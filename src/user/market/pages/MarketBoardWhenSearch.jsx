import { useEffect, useRef, useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import '../styles/MarketCommonStyles.css';
import MarketWriteArticleFloatingFixedButton from "../components/MarketWriteArticleFloatingFixedButton";
import MarketSearchDivision from "../commons/test/example/MarketSearchDivision";
import { Link, useNavigate, useParams } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

function MarketArticleElement({marketArticleElem1}) {
    
    const BACKEND_BASE_URL = "http://localhost:8080";
    
    const { article, userInfo } = marketArticleElem1;
    
    const imageLinkPath = article.imageLink;
    
    const imageLinkURL = `${BACKEND_BASE_URL}${imageLinkPath}`;
    
    function funcSellEnded(sellEnded) {
        
        if (sellEnded == 1) {
            
            return (
                <>
                    거래 완료
                </>
            );
            
        } else {
            
            return (
                <>
                    거래 미완료
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
                        ￦ {productCost}
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
                        <div className = "row" style = {{height : "5rem", marginBottom : "1rem"}}>
                            <div className = "col" style = {{paddingLeft : "0.8125rem", paddingRight : "0.8125rem"}}>
                                <div className = "row">
                                    <div className = "col" style = {{marginLeft : "0.8125rem", marginRight : "0.8125rem"}}>
                                        <Link className = "linkDefault" to = {`/market/article/${article.id}`}>
                                            <div className = "row">
                                                <div className = "col-auto" style = {{width : "5rem", height : "5rem", overflow : "hidden", position : "relative",
                                                    paddingLeft : "0rem", paddingRight : "0rem", marginRight : "0.6125rem"}}>
                                                    <MarketProductMainImage imageLinkURL = {imageLinkURL}/>
                                                </div>
                                                <div className = "col" style = {{position : "relative"}}>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "0.5rem"}}>
                                                            {funcSellEnded(article.sellEnded)}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "0.75rem"}}>
                                                            {article.title}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "0.5rem"}}>
                                                            {article.createdAt.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "0.6125rem"}}>
                                                            {userInfo.nickname}
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "0.8125rem", fontWeight : "bold", position : "absolute", bottom : "0rem"}}>
                                                            {funcFreeShare(article.productCost)}
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
    
    const [marketArticleList, setMarketArticleList] = useState([
        {id : 0, marketUserId : 0, imageLink : null, imageOriginalFilename : null, mainImageId : 0,
        title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
        viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")}
    ]) 
    
    const [marketUserInfoList, setMarketUserInfoList] = useState([
        {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    ])
    
    const mergedList = marketArticleList.map(article => {
        const userInfo = marketUserInfoList.find(user => user.userId === article.marketUserId);
        return { article, userInfo };
    });
    
    const [inputSearchWord, setInputSearchWord] = useState("");
    // console.log("inputSearchWord");
    // console.log(inputSearchWord);
    
    const [mergeMarketArticleInfo, setMergeMarketArticleInfo] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ])
    
    const constMarketArticleElementList = mergeMarketArticleInfo.map((mergedElement) => (
        <MarketArticleElement key = {mergedElement.article.id} marketArticleElem1 = {mergedElement} />
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
        
    }, [loadedSearchWord]);
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
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
                
                <div className = "row">
                    <div className = "col primaryDivisionDefault" style = {{position : "relative", height : "100%", overflowX : "hidden"}}>
                        
                        <MarketSearchDivision inputSearchWord = {inputSearchWord} constApplySearchWord = {constApplySearchWord} 
                        constButtonToSendSearchWordParam = {constButtonToSendSearchWordParam} searchWordRef = {searchWordRef}/>
                        
                        {
                            (checkSearchWord != '') ?
                            (
                                <>
                                            
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "0.8125rem"}}>
                                            <span>"</span>
                                            <span style = {{fontWeight : "bold"}}>{checkSearchWord}</span>
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
                        
                        <MarketWriteArticleFloatingFixedButton />
                        
                    </div>
                </div>
                
            </div>
        
        </>
        
    )
    
}