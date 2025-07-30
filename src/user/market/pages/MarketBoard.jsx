import { useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import '../styles/MarketCommonStyles.css';
import MarketWriteArticleFloatingFixedButton from "../components/MarketWriteArticleFloatingFixedButton";

function MarketArticleElement({marketArticleElem1}) {
    
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
                                        <div className = "row">
                                            <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
                                                paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh"}}>
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
                                                        {marketArticleElem1.articleTitle}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                        {marketArticleElem1.createdAt.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                        {marketArticleElem1.marketUserNickname}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "2vh", fontWeight : "bold", position : "absolute", bottom : "0vh"}}>
                                                        ￦ {marketArticleElem1.productCost}
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

export default function MarketBoardPage() {
    
    const [marketArticleList, setMarketArticleList] = useState([
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
    
    const constMarketArticleElementList = 
    marketArticleList.map(artlcleElement => <MarketArticleElement key = {artlcleElement.id} marketArticleElem1 = {artlcleElement}/>);
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col primaryDivisionDefault" style = {{position : "relative", height : "80vh", overflowX : "hidden"}}>
                        
                        {
                            constMarketArticleElementList.length  > 0 ? constMarketArticleElementList : <></>
                        }
                        
                        <MarketWriteArticleFloatingFixedButton />
                        
                    </div>
                </div>
                
            </div>
        
        </>
        
    )
    
}