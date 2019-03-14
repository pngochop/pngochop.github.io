const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function sliceImage(src,
                    frameWidth,
                    frameHeight,
                    xOffset = 0,
                    yOffset = 0,
                    frameCount = Number.MAX_SAFE_INTEGER) {
    let images = [];
    images.width = frameWidth;
    images.height = frameHeight;

    let nTilesY = Math.floor(src.height / frameHeight);
    let nTilesX = Math.floor(src.width / frameWidth);

    let nOffsetY = Math.floor(yOffset / frameHeight);
    let nOffsetX = Math.floor(xOffset / frameWidth);
    canvas.width = frameWidth;
    canvas.height = frameHeight;

    for (let ty = 0; ty < nTilesY && images.length < frameCount; ty++) {
        if (ty < nOffsetY) continue;
        for (let tx = 0; tx < nTilesX && images.length < frameCount; tx++) {
            if (ty == nOffsetY && tx < nOffsetX) continue;
            let x = tx * frameWidth + (ty == nOffsetX ? xOffset : 0);
            let y = ty * frameHeight + yOffset;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(src, -x, -y);

            let img = new Image();
            img.src = canvas.toDataURL('image/png');
            img.width = frameWidth;
            img.height = frameHeight;

            images.push(img);
        }
    }

    return images;
}

export default {sliceImage};