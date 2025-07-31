import { useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";

function MarketUserLikedProductElement({marketUserLikedProductElem1}) {
    
    return (
        <>
        
            <div className = "row">
                <div className = "widthDefault">
                    <div className = "col">
                        {/* {marketArticleElem1.id}, {marketArticleElem1.marketUserId}, {marketArticleElem1.marketUserNickname}, {marketArticleElem1.imageLink}, {marketArticleElem1.mainImageLink}, 
                        {marketArticleElem1.articleTitle}, {marketArticleElem1.articleContent}, {marketArticleElem1.productCostOption}, {marketArticleElem1.productCost},
                        {marketArticleElem1.viewedCount}, {marketArticleElem1.isSellEnded}, {marketArticleElem1.createdAt.toLocaleString()}, {marketArticleElem1.updatedAt}
                        
                        { 날짜 값이 null 인 경우와 null 이 아닌 경우를 철저히 체크할 것 (toLocaleString 시 오류 방지) */}
                        <div className = "row" style = {{height : "12.5vh", marginBottom : "1vh"}}>
                            <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                <div className = "row">
                                    <div className = "col" style = {{marginLeft : "2vh", marginRight : "2vh"}}>
                                        <div className = "row h-100">
                                            <div className = "col-auto" style = {{paddingLeft : "2vh", paddingRight : "2vh", display : "flex", alignItems : "center"}}>
                                                <i className="ri-heart-3-fill"></i>
                                            </div>
                                            <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
                                                paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh", display : "flex", alignItems : "center"}}>
                                                <MarketProductMainImage />
                                            </div>
                                            <div className = "col" style = {{position : "relative"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                        미완료
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.75vh"}}>
                                                        {marketUserLikedProductElem1.articleTitle}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                        {marketUserLikedProductElem1.createdAt.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                        {marketUserLikedProductElem1.marketUserNickname}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "2vh", fontWeight : "bold", position : "absolute", bottom : "0vh"}}>
                                                        ￦ {marketUserLikedProductElem1.productCost}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
    
}

export default function MarketMyLikedProductsPage() {
    
    const [marketuserLikedProductList, setMarketUserLikedProductList] = useState([
        {id : 1, marketUserId : 1, marketUserNickname : "GreatDevil", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 12345, 
        viewedCount : 67, isSellEnded : 0, createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
        {id : 2, marketUserId : 2, marketUserNickname : "EvilAngel", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 67890, 
        viewedCount : 89, isSellEnded : 0, createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
        {id : 3, marketUserId : 3, marketUserNickname : "ArmWrestler", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 98765, 
        viewedCount : 12, isSellEnded : 0, createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
        {id : 4, marketUserId : 4, marketUserNickname : "GymThief", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 43210, 
        viewedCount : 34, isSellEnded : 0, createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null}
    ]) 
    
    const constmarketuserLikedProductElementList = 
    marketuserLikedProductList.map(userLikedProductElement => <MarketUserLikedProductElement key = {userLikedProductElement.id} marketUserLikedProductElem1 = {userLikedProductElement}/>);
    
    return(
        <>
        
            <div className = "row">
                <div className = "widthDefault">
                    <div className = "col">
                        <div className = "row">
                            <div className = "col primaryDivisionDefault" style = {{height : "80vh", overflowX : "hidden"}}>
                                <div className = "row">
                                    <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.875vh"}}>
                                                        내가 탐낸 물품 개수
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                                                        4 개
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className = "row gx-0">
                                            <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", marginBottom : "0.5vh", paddingTop : "2vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                        {
                                                            constmarketuserLikedProductElementList.length  > 0 ? constmarketuserLikedProductElementList : <></>
                                                        }
                                                        {/*
                                                            * 해당 const 리스트의 제일 왼쪽에 하트 활성화, 비활성화로 물품의 탐냄 상태를 반영함. (새로고침 시 하트를 비활성화한 물품 상세 글은, 내가 탐낸 물품 목록에서 사라짐)
                                                        */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                <i className="ri-information-line"></i> 하트를 눌러서 탐냄 상태를 바꿀 수 있다오.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
    
}