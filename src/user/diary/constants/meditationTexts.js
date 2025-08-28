// 감정별 명상 메시지 데이터
const meditationTexts = {
    "행복": [
        "행복은 나누면 두 배가 됩니다. 오늘의 기쁨을 주변과 함께 나눠보세요.",
        "행복한 순간을 일기에 기록하면, 힘든 날에 다시 꺼내볼 수 있어요.",
        "작은 행복에 감사하는 마음이 더 큰 행복을 가져옵니다.",
    ],
    "좋음": [
        "긍정적인 마음가짐이 더 나은 하루를 만듭니다.",
        "오늘의 좋은 기운을 내일도 이어가보세요.",
        "좋은 날씨처럼, 당신의 기분도 맑고 상쾌하네요.",
    ],
    "슬픔": [
        "슬픔도 지나가는 구름처럼, 잠시 머물다 가는 감정일 뿐입니다.",
        "힘든 감정도 나를 성장시키는 자양분이 될 수 있어요.",
        "혼자가 아닙니다. 주변의 도움을 받아들이는 것도 좋아요.",
    ],
    "화": [
        "깊은 호흡과 함께 마음을 가라앉혀보세요.",
        "화는 나를 힘들게 하는 감정이에요. 잠시 멈추고 생각해보세요.",
        "분노를 느끼는 것은 자연스러운 일이에요. 하지만 그것에 휘둘리지 마세요.",
    ],
    "평온": [
        "평온한 마음이 최고의 선물입니다.",
        "고요한 마음으로 오늘 하루를 되돌아보세요.",
        "평화로운 마음을 유지하는 것이 중요해요.",
    ],
    "부끄러움": [
        "부끄러움은 겸손과 성장의 시작입니다.",
        "실수를 통해 우리는 더 성장할 수 있어요.",
        "자신을 너무 가혹하게 책망하지 마세요. 누구나 실수할 수 있습니다.",
    ],
};

// 랜덤 명상 메시지 선택 함수
function getRandomMeditation(emotion) {
    const texts = meditationTexts[emotion];
    if (!texts || texts.length === 0) {
        return "오늘도 수고했어요. 내일은 더 좋은 하루가 될 거예요.";
    }
    return texts[Math.floor(Math.random() * texts.length)];
}

// 상위 감정들에 대한 명상 메시지 반환 함수
function getMeditationByTopEmotions(emotionStats) {
    if (!emotionStats || emotionStats.length === 0) {
        return ["아직 기록된 감정이 없어요.", "일기를 작성하고 감정을 기록해보세요.", "작은 실천이 큰 변화를 만듭니다."];
    }

    return emotionStats.slice(0, 3).map(stat => {
        return getRandomMeditation(stat.emotion_name || '평온');
    });
}

export default {
    getRandomMeditation,
    getMeditationByTopEmotions,
    meditationTexts
};
