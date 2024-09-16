"use client"

import React, { useState } from 'react'
import { AiFillLike } from 'react-icons/ai'

function Like() {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleClick = () => {
        if (liked) {
            setLiked(false);
            setLikeCount(likeCount - 1);
        } else {
            setLiked(true);
            setLikeCount(likeCount + 1);
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <AiFillLike color={liked ? "aqua" : "gray"} size="25" />
            <span style={{
                marginLeft: '10px',
                fontSize: '24px',
                userSelect: 'none'
            }}>{likeCount}
            </span>
        </div>
    )
}

export default Like;
