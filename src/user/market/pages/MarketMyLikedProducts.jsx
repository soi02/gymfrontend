import { useEffect, useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import { Link } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

export default function MarketMyLikedProductsPage() {
    
    const checkUserStatus = 1;
    const defaultUserStatus = 1004;
    
    const [checkLoadEnded, setCheckLoadEnded] = useState(true);
    const [reloadProcessing, setReloadProcessing] = useState(false);
    
    const [marketuserLikedProductList, setMarketUserLikedProductList] = useState([
        {id : 1, marketUserId : 11, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 12345, 
        viewedCount : 67, sellEnded : 0, createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
        {id : 2, marketUserId : 12, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 67890, 
        viewedCount : 89, sellEnded : 0, createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
        {id : 3, marketUserId : 13, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 98765, 
        viewedCount : 12, sellEnded : 0, createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
        {id : 4, marketUserId : 14, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 43210, 
        viewedCount : 34, sellEnded : 0, createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null}
    ]) 
    
    const [marketUserInfoListOnLikedProduct, setMarketUserInfoListOnLikedProduct] = useState([
        {id : 11, userId : 11, nickname : "GreatDevil", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 12, userId : 12, nickname : "EvilAngel", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 13, userId : 13, nickname : "ArmWrestler", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 14, userId : 14, nickname : "GymThief", createdAt : new Date("2024-06-09T12:34:56")}
    ])
    
    const mergedListOnLikedProduct = marketuserLikedProductList.map(article => {
        const userInfo = marketUserInfoListOnLikedProduct.find(user => user.userId === article.marketUserId);
        return { article, userInfo };
    });
    
    const [mergeMarketUserLikedProduct, setMergeMarketUserLikedProduct] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ]);
    
    const constmarketuserLikedProductElementList = 
    mergeMarketUserLikedProduct.map(mergedElement => (
    <MarketUserLikedProductElement key = {mergedElement.article.id} marketUserLikedProductElem1 = {mergedElement}/>));
    
    const MarketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            try {
                
                const [ constGetSelectMarketProductInterestedLogWhenUserInfo ] = await Promise.all([
                    MarketAPI.getSelectMarketProductInterestedLogWhenUserInfo(2)
                ])
                console.log(constGetSelectMarketProductInterestedLogWhenUserInfo)
                
                const constMarketUserLikedProductElemtnsFromAPI = constGetSelectMarketProductInterestedLogWhenUserInfo.map(APIElem1 => ({
                    interestedLog : APIElem1.marketProductInterestedLogDto,
                    userInfo : APIElem1.marketUserInfoDto,
                    article : APIElem1.marketArticleDto
                }))
                console.log(constMarketUserLikedProductElemtnsFromAPI);
                setMergeMarketUserLikedProduct(constMarketUserLikedProductElemtnsFromAPI);
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            } finally {
                
                setCheckLoadEnded(false);
                
            }
            
        }
        
        constUseEffect();
        
    }, [])
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (reloadProcessing) {
             
                try {
                    
                    const [ constGetSelectMarketProductInterestedLogWhenUserInfo ] = await Promise.all([
                        MarketAPI.getSelectMarketProductInterestedLogWhenUserInfo(2)
                    ])
                    console.log(constGetSelectMarketProductInterestedLogWhenUserInfo)
                    
                    const constMarketUserLikedProductElemtnsFromAPI = constGetSelectMarketProductInterestedLogWhenUserInfo.map(APIElem1 => ({
                        interestedLog : APIElem1.marketProductInterestedLogDto,
                        userInfo : APIElem1.marketUserInfoDto,
                        article : APIElem1.marketArticleDto
                    }))
                    console.log("Test2");
                    console.log(constMarketUserLikedProductElemtnsFromAPI);
                    setMergeMarketUserLikedProduct(constMarketUserLikedProductElemtnsFromAPI);
                    
                } catch (error) {
                    
                    console.error("로드 실패:", error);
                    
                } finally {
                    
                    setCheckLoadEnded(false);
                    
                }
                
            }
            
        }
        
        constUseEffect();
        
    }, [reloadProcessing]) // useEffect for Reloading
    
    useEffect(() => {
        
        if (checkLoadEnded) {
            
        } else {
            
            const constmarketuserLikedProductElementList = 
            mergeMarketUserLikedProduct.map(mergedElement => (
            <MarketUserLikedProductElement key = {mergedElement.article.id} marketUserLikedProductElem1 = {mergedElement}/>));
            console.log(mergeMarketUserLikedProduct);
            
            setCheckLoadEnded(true);
            
        }
        
    }, [checkLoadEnded]) // useEffect for Checking Load Ended
        
    function MarketUserLikedProductElement({marketUserLikedProductElem1}) {
        
        const { article, userInfo } = marketUserLikedProductElem1;
        
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
                                            <div className = "row h-100">
                                                <div className = "col-auto" style = {{paddingLeft : "2vh", paddingRight : "2vh", display : "flex", alignItems : "center"}}>
                                                    <i className="ri-heart-3-fill"></i>
                                                </div>
                                                <div className = "col">
                                                    <Link className = "linkDefault" to = {`/gymmadang/market/article/${article.id}`}>
                                                        <div className = "row">
                                                            <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
                                                                paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh", display : "flex", alignItems : "center"}}>
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
                    </div>
                </div>
            
            </>
        )
        
    }
    
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
                                                            constmarketuserLikedProductElementList.length > 0 ? 
                                                            constmarketuserLikedProductElementList : 
                                                            <>
                                                
                                                                탐낸 물품이 없다오.
                                                
                                                            </>
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