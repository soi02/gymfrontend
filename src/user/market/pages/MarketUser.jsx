import { useEffect, useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketUserInfosOnUserPage from "../commons/test/example/MarketUserInfosOnUserPage";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import '../styles/MarketCommonStyles.css';
import { Link } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

function MarketUserSoldProductElement({marketUserSoldProductElem1}) {
    
    const { article, userInfo } = marketUserSoldProductElem1;
    
    function funcSellEnded(sellEnded) {
        
        if (sellEnded == 1) {
            
            return "완료";
            
        } else if (sellEnded == 0) {
            
            return "미완료";
            
        }
        
    }
    
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
                                                            {funcSellEnded(article.sellEnded)}
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

function MarketUserBoughtProductElement({marketUserBoughtProductElem1}) {
    
    const { article, userInfo } = marketUserBoughtProductElem1;
    
    function funcSellEnded(sellEnded) {
        
        if (sellEnded == 1) {
            
            return "완료";
            
        } else if (sellEnded == 0) {
            
            return "미완료";
            
        }
        
    }
    
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
                                                            {funcSellEnded(article.sellEnded)}
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
                                                {marketUserRateElem1.content}
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
    
    const checkUserStatus = 2;
    const defaultUserStatus = 1004;
    
    const [checkLoadEnded, setCheckLoadEnded] = useState(true);
    
    const [marketUserInfo, setMarketUserInfo] = useState([
        {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    ])
    
    const constMarketUserInfoElement =
    marketUserInfo.map(userInfoElement => <MarketUserInfosOnUserPage key = {userInfoElement.id} marketUserInfoElem1 = {userInfoElement}/>);
    
    // const [marketuserSoldProductList, setMarketUserSoldProductList] = useState([
    //     {id : 5, marketUserId : 1004, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 13579, 
    //     viewedCount : 13, sellEnded : 0, createdAt : new Date("2024-06-14T12:34:56"), updatedAt : null},
    //     {id : 6, marketUserId : 1004, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 24680, 
    //     viewedCount : 24, sellEnded : 0, createdAt : new Date("2024-06-15T12:34:56"), updatedAt : null},
    //     {id : 7, marketUserId : 1004, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 86420, 
    //     viewedCount : 35, sellEnded : 0, createdAt : new Date("2024-06-16T12:34:56"), updatedAt : null},
    //     {id : 8, marketUserId : 1004, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 97531, 
    //     viewedCount : 46, sellEnded : 0, createdAt : new Date("2024-06-17T12:34:56"), updatedAt : null}
    // ]) 
    
    // const [marketUserInfoOnSoldProduct, setMarketUserInfoOnSoldProduct] = useState([
    //     {id : 1004, userId : 1004, nickname : "GoodDevil", createdAt : new Date("2024-06-09T12:34:56")}
    // ])
    
    // const mergedListOnSoldProduct = marketuserSoldProductList.map(article => {
    //     const userInfo = marketUserInfoOnSoldProduct.find(user => user.userId === article.marketUserId);
    //     return { article, userInfo };
    // });
    
    // const [marketuserBoughtProductList, setMarketUserBoughtProductList] = useState([
    //     {id : 1, marketUserId : 11, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 12345, 
    //     viewedCount : 67, sellEnded : 0, createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
    //     {id : 2, marketUserId : 12, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 67890, 
    //     viewedCount : 89, sellEnded : 0, createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
    //     {id : 3, marketUserId : 13, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 98765, 
    //     viewedCount : 12, sellEnded : 0, createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
    //     {id : 4, marketUserId : 14, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 43210, 
    //     viewedCount : 34, sellEnded : 0, createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null}
    // ]) 
    
    // const [marketUserInfoOnBoughtProduct, setMarketUserInfoOBoughtProduct] = useState([
    //     {id : 11, userId : 11, nickname : "GreatDevil", createdAt : new Date("2024-06-09T12:34:56")},
    //     {id : 12, userId : 12, nickname : "EvilAngel", createdAt : new Date("2024-06-09T12:34:56")},
    //     {id : 13, userId : 13, nickname : "ArmWrestler", createdAt : new Date("2024-06-09T12:34:56")},
    //     {id : 14, userId : 14, nickname : "GymThief", createdAt : new Date("2024-06-09T12:34:56")}
    // ])
    
    // const mergedListOnBoughtProduct = marketuserBoughtProductList.map(article => {
    //     const userInfo = marketUserInfoOnBoughtProduct.find(user => user.userId === article.marketUserId);
    //     return { article, userInfo };
    // });
    
    const [ mergeMarketUserSoldProduct, setMergeMarketUserSoldProduct ] = useState([
        {
        
            article : {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")},
            soldLog : {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
            
        }
    ]);
    
    const [ mergeMarketUserBoughtProduct, setMergeMarketUserBoughtProduct ] = useState([
        {
        
            article : {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")},
            boughtLog : {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
            
        }
    ]);
    
    const constmarketuserSoldProductElementList = 
    mergeMarketUserSoldProduct.map(mergedElement => (
    <MarketUserSoldProductElement key = {mergedElement.article.id} marketUserSoldProductElem1 = {mergedElement}/>));
    
    const constmarketuserBoughtProductElementList = 
    mergeMarketUserBoughtProduct.map(mergedElement => (
    <MarketUserBoughtProductElement key = {mergedElement.article.id} marketUserBoughtProductElem1 = {mergedElement}/>));
    
    //
    
    const [marketuserRateList, setMarketUserRateList] = useState([
        {id : 1, writerId : 11, evaluatedUserId : 1004, content : "Cow Went, My Dragon. 1",
        createdAt : new Date("2024-07-10T12:34:56"), updatedAt : null},
        {id : 2, writerId : 12, evaluatedUserId : 1004, content : "Cow Went, My Dragon. 2",
        createdAt : new Date("2024-07-11T12:34:56"), updatedAt : null},
        {id : 3, writerId : 13, evaluatedUserId : 1004, content : "Cow Went, My Dragon. 3",
        createdAt : new Date("2024-07-12T12:34:56"), updatedAt : null},
        {id : 4, writerId : 14, evaluatedUserId : 1004, content : "Cow Went, My Dragon. 4",
        createdAt : new Date("2024-07-13T12:34:56"), updatedAt : null},
    ]) 
    
    const constmarketuserRateElementList = 
    marketuserRateList.map(userRateElement => <MarketUserRateElement key = {userRateElement.id} marketUserRateElem1 = {userRateElement}/>);
    
    // ▲ 최후반 구현 순위
    
    const marketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            try {
                
                const [ constGetSelectMarketUserInfo, constGetSelectMarketDealedLogWhenSeller, constGetSelectMarketDealedLogWhenBuyer,  ] = await Promise.all ([
                    marketAPI.getSelectMarketUserInfo(checkUserStatus),
                    marketAPI.getSelectMarketDealedLogWhenSeller(checkUserStatus),
                    marketAPI.getSelectMarketDealedLogWhenBuyer(checkUserStatus)
                ])
                setMarketUserInfo([constGetSelectMarketUserInfo]);
                const constSoldProductElementsFromAPI = constGetSelectMarketDealedLogWhenSeller.map(APIElem1 => ({
                    article : APIElem1.marketArticleDto,
                    userInfo : APIElem1.marketUserInfoDto,
                    soldLog : APIElem1.marketDealedLogDto
                }))
                setMergeMarketUserSoldProduct(constSoldProductElementsFromAPI);
                const constBoughtProductElementsFromAPI = constGetSelectMarketDealedLogWhenBuyer.map(APIElem1 => ({
                    article : APIElem1.marketArticleDto,
                    userInfo : APIElem1.marketUserInfoDto,
                    boughtLog : APIElem1.marketDealedLogDto
                }))
                setMergeMarketUserBoughtProduct(constBoughtProductElementsFromAPI);
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            } finally {
                
                setCheckLoadEnded(false);
                
            }
            
        }
        
        constUseEffect();
        
    }, []);
    
    useEffect(() => {
        
        if (checkLoadEnded) {
            
        } else {
            
            setCheckLoadEnded(true);
            
        }
        
    }, [checkLoadEnded])
    
    function MarketUserBoughtProductPageLayout() {
        
        if (checkUserStatus == defaultUserStatus) {
        
            return(
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.875vh"}}>
                                    내 판매 물품 개수
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
                                                constmarketuserSoldProductElementList.length > 0 ? 
                                                constmarketuserSoldProductElementList : 
                                                <>
                                            
                                                    판매한 물품이 없다오.
                                            
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            return(
                <>
                
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
                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "2vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                            {
                                                constmarketuserSoldProductElementList.length > 0 ? 
                                                constmarketuserSoldProductElementList : 
                                                <>
                                            
                                                    판매한 물품이 없다오.
                                            
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        }
        
    }
    
    function MarketUserSoldProductPageLayout() {
        
        if (checkUserStatus == defaultUserStatus) {
        
            return(
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.875vh"}}>
                                    내 구매 물품 개수
                                </div>
                            </div>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                                    4 개
                                </div>
                            </div>
                            <div className = "row">
                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "2vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                            {
                                                constmarketuserBoughtProductElementList.length > 0 ? 
                                                constmarketuserBoughtProductElementList : 
                                                <>
                                            
                                                    구매한 물품이 없다오.
                                            
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            return(
                <>
                
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
                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "2vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                            {
                                                constmarketuserBoughtProductElementList.length > 0 ? 
                                                constmarketuserBoughtProductElementList : 
                                                <>
                                            
                                                    구매한 물품이 없다오.
                                            
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        }
        
    }
    
    function MarketUserRatePageLayout() {
        
        if (checkUserStatus == defaultUserStatus) {
        
            return(
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.875vh"}}>
                                    내 신뢰 평가 개수
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
                                                constmarketuserRateElementList.length > 0 ? 
                                                constmarketuserRateElementList : 
                                                <>
                                                
                                                    평가말이 없다오.
                                                
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            return(
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.875vh"}}>
                                    신뢰 평가 개수
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
                                                constmarketuserRateElementList.length > 0 ? 
                                                constmarketuserRateElementList : 
                                                <>
                                                
                                                    평가말이 없다오.
                                                
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        }
        
    }
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col primaryDivisionDefault" style = {{height : "80vh", overflowX : "hidden"}}>
                        
                        {
                            constMarketUserInfoElement.length  > 0 ? constMarketUserInfoElement : <></>
                        }
                        
                        {<MarketUserBoughtProductPageLayout />}
                        
                        {<MarketUserSoldProductPageLayout />}
                        
                        {<MarketUserRatePageLayout />}
                        
                    </div>
                </div>
                
            </div>
        
        </>
        
    )
    
}