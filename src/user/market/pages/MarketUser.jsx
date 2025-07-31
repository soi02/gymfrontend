import { useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketUserInfosOnUserPage from "../commons/test/example/MarketUserInfosOnUserPage";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import '../styles/MarketCommonStyles.css';

function MarketUserSoldProductElement({marketUserSoldProductElem1}) {
    
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
                                                        {marketUserSoldProductElem1.articleTitle}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                        {marketUserSoldProductElem1.createdAt.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                        {marketUserSoldProductElem1.marketUserNickname}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "2vh", fontWeight : "bold", position : "absolute", bottom : "0vh"}}>
                                                        ￦ {marketUserSoldProductElem1.productCost}
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

function MarketUserBoughtProductElement({marketUserBoughtProductElem1}) {
    
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
                                                        {marketUserBoughtProductElem1.articleTitle}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                        {marketUserBoughtProductElem1.createdAt.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                        {marketUserBoughtProductElem1.marketUserNickname}
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "2vh", fontWeight : "bold", position : "absolute", bottom : "0vh"}}>
                                                        ￦ {marketUserBoughtProductElem1.productCost}
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

function MarketUserRateElement({marketUserRateElem1}) {
    
    return (
        <>

            <div className = "row">
                <div className = "widthDefault">
                    <div className = "col">
                        {/* {marketArticleElem1.id}, {marketArticleElem1.marketUserId}, {marketArticleElem1.marketUserNickname}, {marketArticleElem1.imageLink}, {marketArticleElem1.mainImageLink}, 
                        {marketArticleElem1.articleTitle}, {marketArticleElem1.articleContent}, {marketArticleElem1.productCostOption}, {marketArticleElem1.productCost},
                        {marketArticleElem1.viewedCount}, {marketArticleElem1.isSellEnded}, {marketArticleElem1.createdAt.toLocaleString()}, {marketArticleElem1.updatedAt}
                        
                        { 날짜 값이 null 인 경우와 null 이 아닌 경우를 철저히 체크할 것 (toLocaleString 시 오류 방지) */}
                        <div className = "row" style = {{marginBottom : "2vh"}}>
                            <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                <div className = "row">
                                    <div className = "col" style = {{marginLeft : "2vh", marginRight : "2vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center", marginBottom : "0.625vh"}}>
                                                <div className = "row h-100">
                                                    <div className = "col-auto" style = {{width : "4.5vh", height : "4.5vh", overflow : "hidden", position : "relative",
                                                        paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh"}}>
                                                        <MarketAnonymousUserMiniProfileImage />
                                                    </div>
                                                    <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                        <div className = "row h-100">
                                                            <div className = "col-auto" style = {{fontSize : "2.25vh", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                익명
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col" style = {{paddingLeft : "0vh", paddingRight : "0vh", fontSize : "1.75vh"}}>
                                                {marketUserRateElem1.reviewUserContent}
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

export default function MarketUserPage() {
    
    const [marketUserInfo, setMarketUserInfo] = useState([
        {id : 1004, marketUserNickname : "GoodDevil"}
    ])
    
    const constMarketUserInfoElement =
    marketUserInfo.map(userInfoElement => <MarketUserInfosOnUserPage key = {userInfoElement.id} marketUserInfoElem1 = {userInfoElement}/>);
    
    const [marketuserSoldProductList, setMarketUserSoldProductList] = useState([
        {id : 5, marketUserId : 1004, marketUserNickname : "GoodDevil", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 13579, 
        viewedCount : 13, isSellEnded : 0, createdAt : new Date("2024-06-14T12:34:56"), updatedAt : null},
        {id : 6, marketUserId : 1004, marketUserNickname : "GoodDevil", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 24680, 
        viewedCount : 24, isSellEnded : 0, createdAt : new Date("2024-06-15T12:34:56"), updatedAt : null},
        {id : 7, marketUserId : 1004, marketUserNickname : "GoodDevil", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 86420, 
        viewedCount : 35, isSellEnded : 0, createdAt : new Date("2024-06-16T12:34:56"), updatedAt : null},
        {id : 8, marketUserId : 1004, marketUserNickname : "GoodDevil", imageLink : null, mainImageLink : null,
        articleTitle : "My Neck", articleContent : "My Dragon", productCostOption : 1, productCost : 97531, 
        viewedCount : 46, isSellEnded : 0, createdAt : new Date("2024-06-17T12:34:56"), updatedAt : null}
    ]) 
    
    const constmarketuserSoldProductElementList = 
    marketuserSoldProductList.map(userSoldProductElement => <MarketUserSoldProductElement key = {userSoldProductElement.id} marketUserSoldProductElem1 = {userSoldProductElement}/>);
    
    const [marketuserBoughtProductList, setMarketUserBoughtProductList] = useState([
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
    
    const constmarketuserBoughtProductElementList = 
    marketuserBoughtProductList.map(userBoughtProductElement => <MarketUserBoughtProductElement key = {userBoughtProductElement.id} marketUserBoughtProductElem1 = {userBoughtProductElement}/>);
    
    const [marketuserRateList, setMarketUserRateList] = useState([
        {id : 1, marketUserAnonymousNickname : "Anonymous1", reviewUserContent : "Cow Went, My Dragon. 1",
        createdAt : new Date("2024-07-10T12:34:56"), updatedAt : null},
        {id : 2, marketUserAnonymousNickname : "Anonymous2", reviewUserContent : "Cow Went, My Dragon. 2",
        createdAt : new Date("2024-07-11T12:34:56"), updatedAt : null},
        {id : 3, marketUserAnonymousNickname : "Anonymous3", reviewUserContent : "Cow Went, My Dragon. 3",
        createdAt : new Date("2024-07-12T12:34:56"), updatedAt : null},
        {id : 4, marketUserAnonymousNickname : "Anonymous4", reviewUserContent : "Cow Went, My Dragon. 4",
        createdAt : new Date("2024-07-13T12:34:56"), updatedAt : null},
    ]) 
    
    const constmarketuserRateElementList = 
    marketuserRateList.map(userRateElement => <MarketUserRateElement key = {userRateElement.id} marketUserRateElem1 = {userRateElement}/>);
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col primaryDivisionDefault" style = {{height : "80vh", overflowX : "hidden"}}>
                        
                        {
                            constMarketUserInfoElement.length  > 0 ? constMarketUserInfoElement : <></>
                        }
                        
                        <div className = "row">
                            <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "1.875vh"}}>
                                        판매 물품 개수
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                                        4 개
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                {
                                                    constmarketuserSoldProductElementList.length  > 0 ? constmarketuserSoldProductElementList : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className = "row">
                            <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "1.875vh"}}>
                                        구매 물품 개수
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                                        4 개
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                {
                                                    constmarketuserBoughtProductElementList.length  > 0 ? constmarketuserBoughtProductElementList : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className = "row">
                            <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "1.875vh"}}>
                                        유저 신뢰 평가 개수
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                                        4 개
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2.25vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                {
                                                    constmarketuserRateElementList.length  > 0 ? constmarketuserRateElementList : <></>
                                                }
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