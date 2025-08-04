import { useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import '../styles/MarketCommonStyles.css';
import MarketWriteArticleFloatingFixedButton from "../components/MarketWriteArticleFloatingFixedButton";
import MarketSearchDivision from "../commons/test/example/MarketSearchDivision";
import { Link } from "react-router-dom";

function MarketArticleElement({marketArticleElem1}) {
    
    const { article, userInfo } = marketArticleElem1;
    
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
                                        <Link className = "linkDefault" to = {`/gymmadang/market/article/${article.id}`}>
                                            <div className = "row">
                                                <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
                                                    paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh"}}>
                                                    <MarketProductMainImage />
                                                </div>
                                                <div className = "col" style = {{position : "relative"}}>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                            {article.sellEnded}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1.75vh"}}>
                                                            {article.title}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                            {article.createdAt.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                            {userInfo.nickname}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "2vh", fontWeight : "bold", position : "absolute", bottom : "0vh"}}>
                                                            ￦ {article.productCost}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
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
        {id : 1, marketUserId : 1004, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 12345, 
        viewedCount : 67, sellEnded : 0, createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
        {id : 2, marketUserId : 1004, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 67890, 
        viewedCount : 89, sellEnded : 0, createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
        {id : 3, marketUserId : 1004, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 98765, 
        viewedCount : 12, sellEnded : 0, createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
        {id : 4, marketUserId : 1004, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 43210, 
        viewedCount : 34, sellEnded : 0, createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null}
    ]) 
    
    const [marketUserInfoList, setMarketUserInfoList] = useState([
        {id : 1004, userId : 1004, nickname : "GoodDevil", createdAt : new Date("2024-06-09T12:34:56")}
    ])
    
    const mergedList = marketArticleList.map(article => {
        const userInfo = marketUserInfoList.find(user => user.userId === article.marketUserId);
        return { article, userInfo };
    });
    
    const constMarketArticleElementList = mergedList.map((mergedElement) => (
        <MarketArticleElement key = {mergedElement.article.id} marketArticleElem1 = {mergedElement} />
    ))
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col primaryDivisionDefault" style = {{position : "relative", height : "80vh", overflowX : "hidden"}}>
                        
                        <MarketSearchDivision />
                        
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