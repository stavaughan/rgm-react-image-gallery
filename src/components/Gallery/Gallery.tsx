import React, { useEffect, useState, useCallback } from "react";
import ImageGallery from "react-image-gallery";
import type { ReactImageGalleryItem } from "react-image-gallery";
import type { Image } from './Gallery.types'

const API_URI = import.meta.env.VITE_API_URI as string

const Gallery = () => {

    const [loaded, setLoaded] = useState(false)

    const [images, setImages] = useState([])

    const dataFetch = useCallback(async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = { method: 'GET', headers, redirect: 'follow' } as RequestInit;
        const res = await fetch(API_URI, requestOptions)
        const data = await res.json()
        const images = data.images.map((image: Image, idx: number) => ({
            original: image.src,
            srcSet: image.srcset,
            thumbnail: image.thumbnail || `${image.src}-/resize/250x/`,
            originalAlt: image.alt || `demo-image-${idx + 1}`,
            loading: "eager",
            thumbnailLoading: "eager",
        } as ReactImageGalleryItem));
        setImages(images);
    }, [])

    useEffect(() => {
        dataFetch()
    }, []);

    return (
        <div>
            {loaded && <div>Loaded {images.length} images</div>}
            <ImageGallery
                items={images}
                lazyLoad={!loaded}
                showNav={loaded}
                showPlayButton={loaded}
                showThumbnails={loaded}
                showFullscreenButton={loaded}
                thumbnailPosition="bottom"
                onImageLoad={() => setLoaded(true)}
            />
            {!loaded && <div>Loading...</div>}
        </div>
    )
}

export default Gallery