import { useEffect, useRef, useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import '../styles/MarketCommonStyles.css';
import MarketWriteArticleFloatingFixedButton from "../components/MarketWriteArticleFloatingFixedButton";
import MarketSearchDivision from "../commons/test/example/MarketSearchDivision";
import { Link, useNavigate, useParams } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

function MarketArticleElement({marketArticleElem1}) {
    
    const BACKEND_BASE_URL = "http://localhost:8080";
    
    // const {searchWord : loadedSearchWord} = useParams();
        
    const { article = {} , userInfo = {} } = marketArticleElem1 ?? "";
    
    const imageLinkPath = article?.imageLink;
    
    const imageLinkURL = new URL(imageLinkPath ?? "", BACKEND_BASE_URL).toString();
    
    const formatProductCost = (productCost) => {
        return productCost.toLocaleString('Ko-KR');
    };
    
    function funcSellEnded(sellEnded) {
        
        if (sellEnded == 1) {
            
            return (
                <>
                    <span className = "badge badgeStyleAboutConfirmedDeal" style = {{fontSize : "0.625rem"}}>
                    <i className="ri-checkbox-circle-line"></i> 거래 마감</span>
                </>
            );
            
        } else {
            
            return (
                <>
                    <span className = "badge badgeStyleAboutUnconfirmedDeal" style = {{fontSize : "0.625rem"}}>거래 가능</span>
                </>
            );
            
        }
        
    }
    
    function funcFreeShare(productCost) {
        
        if (productCost == 0) {
            
            return (
                <>
                    나눔
                </>
            );
            
        } else {
            
            return (
                <>
                    ￦ {formatProductCost(productCost)}
                </>
            );
            
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
                        <div className = "row" style = {{height : "6rem", marginBottom : "1rem"}}>
                            <div className = "col" style = {{paddingLeft : "0.8125rem", paddingRight : "0.8125rem"}}>
                                <div className = "row">
                                    <div className = "col" style = {{marginLeft : "0.8125rem", marginRight : "0.8125rem"}}>
                                        <Link className = "linkDefault" to = {`/market/article/${article?.id}`}>
                                            <div className = "row">
                                                <div className = "col-auto" style = {{width : "6rem", height : "6rem", overflow : "hidden", position : "relative",
                                                    paddingLeft : "0rem", paddingRight : "0rem", borderRadius : "0.5rem", marginRight : "0.6125rem"}}>
                                                    {imageLinkPath ?
                                                    <>
                                                        <MarketProductMainImage imageLinkURL = {imageLinkURL}/>
                                                    </>
                                                    :
                                                    <>
                                                        <div className = "row" style = {{height : "100%", border : "1px solid #cccccc"}} >
                                                            <div className = "col" style = {{flexGrow : "2", background : "linear-gradient(to left, transparent, #6d6d6d80)"}}>
                                                                
                                                            </div>
                                                            <div className = "col" style = {{flexGrow : "7"}}>
                                                                
                                                            </div>
                                                            <div className = "col" style = {{flexGrow : "2", background : "linear-gradient(to right, transparent, #6d6d6d80)"}}>
                                                                
                                                            </div>
                                                        </div>
                                                    </>
                                                    }
                                                </div>
                                                <div className = "col" style = {{position : "relative", minWidth: "0"}}>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "0.75rem"}}>
                                                            {funcSellEnded(article?.sellEnded)}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1rem"}}>
                                                            <div className = "truncateText" style = {{fontSize : "1.0625rem"}}>
                                                                {article?.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col">
                                                            <div className = "row align-items-center">
                                                                <div className = "col-auto" 
                                                                style = {{
                                                                // width : "2.5vh", height : "2.5vh", overflow : "hidden", position : "relative",
                                                                    fontSize : "1rem", paddingLeft : "0rem", paddingRight : "0rem", marginLeft : "0.6875rem", marginRight : "0.3125rem"}}
                                                                    >
                                                                    {/* <MarketAnonymousUserMiniProfileImage /> */}
                                                                    <i className="bi bi-person-circle"></i>
                                                                </div>
                                                                <div className = "col" style = {{fontSize : "0.875rem", paddingLeft : "0rem", paddingRight : "0rem", lineHeight : "1"}}>
                                                                    {userInfo?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1.125rem", fontWeight : "bold", position : "absolute", bottom : "0rem"}}>
                                                            {funcFreeShare(article?.productCost)}
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

export default function MarketBoardPageWhenSearch() {
    
    const {searchWord : loadedSearchWord} = useParams();
    
    const checkSearchWord = loadedSearchWord ?? '';
    console.log("checkSearchWord");
    console.log(checkSearchWord);
    
    const navigate = useNavigate();
    
    const searchWordRef = useRef(null);
    // if (searchWordRef.current != null) {
        // console.log("searchWordRef.current.value");
        // console.log(searchWordRef.current.value);
    // } // null 체크 꼭 해 주기
    
    //
    
    // const [marketArticleList, setMarketArticleList] = useState([
    //     {id : 0, marketUserId : 0, imageLink : null, imageOriginalFilename : null, mainImageId : 0,
    //     title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
    //     viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")}
    // ]) 
    
    // const [marketUserInfoList, setMarketUserInfoList] = useState([
    //     {id : 0, userId : 0, name : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    // ])
    
    // const mergedList = marketArticleList.map(article => {
    //     const userInfo = marketUserInfoList.find(user => user.userId === article.marketUserId);
    //     return { article, userInfo };
    // });
    
    // ▲ 안 쓰는 코드...??
    
    const [inputSearchWord, setInputSearchWord] = useState("");
    // console.log("inputSearchWord");
    // console.log(inputSearchWord);
    
    // if (!loadedSearchWord) {
        
    //     setInputSearchWord(loadedSearchWord);
        
    // }
    
    const [mergeMarketArticleInfo, setMergeMarketArticleInfo] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, name : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ])
    
    const constMarketArticleElementList = mergeMarketArticleInfo.map((mergedElement) => (
        <MarketArticleElement key = {mergedElement?.article?.id} marketArticleElem1 = {mergedElement} />
    ))
    
    const constApplySearchWord = (element) => {
        
        const constApplySearchWordValue = element.target.value;
        
        setInputSearchWord(constApplySearchWordValue);
        // console.log("constApplySearchWord");
        // console.log(element);
        // console.log("constApplySearchWordValue");
        // console.log(constApplySearchWordValue);
        
    }
    
    const constButtonToSendSearchWordParam = () => {
        
        let constSearchWordParam = "";
        
        if (searchWordRef.current != null) {
            
            constSearchWordParam = searchWordRef.current.value;
            console.log("constSearchWordParam");
            console.log(constSearchWordParam);
            
        }
        
        navigate(`/market/board/${constSearchWordParam}`);
        
    }
    
    const marketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
                
            if (checkSearchWord) {
                
                setInputSearchWord(checkSearchWord);
                console.log("!!!checkSearchWord");
                
            }
            
            try {
                
                const constGetSelectMarketArticle = await marketAPI.selectMarketArticleBySearchWord(checkSearchWord);
                
                // console.log(constGetSelectMarketArticle)
                
                // const constArticleElementFromAPI = constGetSelectMarketArticle.map(mapElem1 =>  mapElem1.marketArticleDto )
                // const constUserInfoElementFromAPI = constGetSelectMarketArticle.map(mapElem1 => mapElem1.marketUserInfoDto )
                
                // setMarketArticleList(constArticleElementFromAPI);
                // setMarketUserInfoList(constUserInfoElementFromAPI);
                
                const constGetSelectMarketArticleAndDistincted = constGetSelectMarketArticle.map(APIElem1 => ({
                    article : APIElem1.marketArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                
                setMergeMarketArticleInfo(constGetSelectMarketArticleAndDistincted);
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            }
            
        }
        
        constUseEffect();
        
    }, [checkSearchWord]);
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            console.log("checkSearchWord??");
            console.log(checkSearchWord);
            console.log("inputSearchWord??");
            console.log(inputSearchWord);
                
            if (checkSearchWord) {
                
                setInputSearchWord(checkSearchWord);
                console.log("!checkSearchWord");
                
            }
            
            try {
                
                const constGetSelectMarketArticle = await marketAPI.selectMarketArticleBySearchWord(checkSearchWord);
                
                const constGetSelectMarketArticleAndDistincted = constGetSelectMarketArticle.map(APIElem1 => ({
                    article : APIElem1.marketArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                
                setMergeMarketArticleInfo(constGetSelectMarketArticleAndDistincted);
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            }
            
        }
        
        constUseEffect();
        
    }, []);
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row" style = {{height : "100vh"}}>
                    <div className = "col h-100" style = {{position : "relative"}}>
                        <div className = "primaryDivisionSizeDefault" style = {{marginTop : "0.125rem"}}>
                            
                            <div className = "row" style = {{height : "100%"}}>
                                <div className = "col primaryDivisionDefault h-100" style = {{position : "relative", overflowX : "hidden", overflowY : "auto"}}>
                                    
                                    <MarketSearchDivision inputSearchWord = {inputSearchWord} constApplySearchWord = {constApplySearchWord} 
                                    constButtonToSendSearchWordParam = {constButtonToSendSearchWordParam} searchWordRef = {searchWordRef}/>
                                    
                                    {
                                        (checkSearchWord != '') ?
                                        (
                                            <>
                                                        
                                                <div className = "row">
                                                    <div className = "col" style = {{marginBottom : "0.8125rem", color : "#6d6d6d"}}>
                                                        <span>"</span>
                                                        <span style = {{fontWeight : "bold", color : "black"}}>{checkSearchWord}</span>
                                                        <span>"</span>
                                                        <span> 단어로 게시글을 찾았소.</span>
                                                    </div>
                                                </div>
                                                        
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                            </>
                                        )
                                    }
                                    

                                    
                                    {
                                        constMarketArticleElementList.length  > 0 ? constMarketArticleElementList : <></>
                                    }
                                    
                                </div>
                            </div>
                                    
                            <div style = {{position : "absolute", top : "0px", left : "0px", width : "100%", height : "100%",
                            zIndex : 2000, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents : "none"}}>
                                <MarketWriteArticleFloatingFixedButton />
                            </div>
                            
                        </div>
                    </div>
                </div>  
                
            </div>
        
        </>
        
    )
    
}