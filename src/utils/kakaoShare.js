// Kakao SDK 초기화
export const initializeKakao = () => {
    if (!window.Kakao.isInitialized()) {
        // 여기에 JavaScript 키를 넣으세요
        window.Kakao.init('카카오API 키 넣기');
    }
};

// 카카오톡 공유하기
export const shareToKakao = (shareData) => {
    if (!window.Kakao.isInitialized()) {
        console.error('Kakao SDK가 초기화되지 않았습니다.');
        return;
    }

    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: shareData.title || '감정 일기',
            description: shareData.description || '나의 감정 일기를 확인해보세요!',
            imageUrl: shareData.imageUrl || 'https://yourwebsite.com/default-image.jpg',
            link: {
                mobileWebUrl: shareData.url,
                webUrl: shareData.url,
            },
        },
        buttons: [
            {
                title: '웹으로 보기',
                link: {
                    mobileWebUrl: shareData.url,
                    webUrl: shareData.url,
                },
            },
        ],
    });
};
