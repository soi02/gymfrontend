import { useRef, useState } from "react";
import MarketFetchMyPhotoOnWriteArticle from "../components/MarketFecthMyPhotoOnWriteArticle";
import useMarketAPI from "../service/MarketService";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import MarketBoardPage from "./MarketBoard";

export default function MarketWriteArticlePage() {
    
    const checkUserStatus = 2;
    
    const navigate = useNavigate();
    
    const titleRef = useRef(null);
    const productCostRef = useRef(null);
    const contentRef = useRef(null);
    
    const [insertMarketArticleElement, setInsertMarketArticleElement] = useState(
        {id : 1, marketUserId : checkUserStatus, imageLink : null, mainImageId : 0, title : "My Neck", content : "My Dragon", productCostOption : 0, productCost : 0,
            viewedCount : 0, sellEnded : 0, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : null
        }
    )
    
    const marketAPI = useMarketAPI();
    
    const constApplyTextContent = (element) => {
        
        const { name, value } = element.target;
        
        setInsertMarketArticleElement({
            ...insertMarketArticleElement,
            [name] : value
        });
        
    }
    
    const constButtonToInsertMarketArticle = async (element) => {
        
        const submitArticleData = {
            ...insertMarketArticleElement,
            title : titleRef.current.value,
            productCost : productCostRef.current.value,
            content : contentRef.current.value
        };
        
        setInsertMarketArticleElement(submitArticleData)
            
        try {
            
            console.log("Code Reaching Test1");
            const constPostInsertMarketArticle = await marketAPI.postInsertMarketArticle(submitArticleData);
            console.log("Successed");
            navigate(`/gymmadang/market`);
            console.log("Code Reaching Test2");
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    return(
        <>
        
            {/* <Routes>
                <Route path = "/gymmadang/market" element = {<MarketBoardPage />}/>
            </Routes> */}
                            
                <div className = "container-fluid">
                    
                    <div className = "row">
                        <div className = "col primaryDivisionDefault" style = {{ height : "75vh", overflowX : "hidden"}}>
                            
                                <div className = "row">
                                    <div className = "col" style = {{marginBottom : "2.5vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
                                                사진
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col" style = {{marginBottom : "2vh"}}>
                                                <div className = "row gx-0">
                                                    <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
                                                    paddingLeft : "0vh", paddingRight : "0vh", border : "0.25vh solid rgb(192, 192, 192)", borderRadius : "1.25vh"}}>
                                                        <MarketFetchMyPhotoOnWriteArticle />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className = "row gx-0">
                                            <div className = "col secondaryDivisionDefault" style = {{fontSize : "1.75vh", paddingTop : "0.75vh", paddingBottom : "0.75vh", paddingLeft : "2vh", paddingRight : "2vh", 
                                            marginBottom : "1vh", height : "9.5vh", overflowY : "auto"}}>
                                                가져온 사진 목록 1 <br />
                                                가져온 사진 목록 2 <br />
                                                가져온 사진 목록 3 <br />
                                                가져온 사진 목록 4 <br />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className = "row">
                                    <div className = "col" style = {{marginBottom : "2.5vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
                                                제목
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col">
                                                <input className = "form-control writeArticleTextDivisionDefault" 
                                                id = "title" name = "title" value = {insertMarketArticleElement.title}
                                                onChange = {constApplyTextContent} ref = {titleRef}
                                                style = {{fontSize : "1.75vh"}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className = "row">
                                    <div className = "col" style = {{marginBottom : "2.5vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
                                                가격
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col">
                                                <input className = "form-control writeArticleTextDivisionDefault" 
                                                id = "productCost" name = "productCost" value = {insertMarketArticleElement.productCost}
                                                onChange = {constApplyTextContent} ref = {productCostRef}
                                                style = {{fontSize : "1.75vh"}}/>
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col" style = {{fontSize : "1.5vh", marginTop : "0.75vh"}}>
                                                <i className="ri-information-line"></i> 0원을 입력할 시 나눔 물품으로 표시됩니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className = "row">
                                    <div className = "col" style = {{marginBottom : "2.5vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
                                                내용
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col">
                                                <textarea className = "form-control writeArticleTextDivisionDefault" 
                                                id = "content" name = "content" value = {insertMarketArticleElement.content}
                                                onChange = {constApplyTextContent} ref = {contentRef}
                                                style = {{fontSize : "1.75vh"}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className = "row">
                                    <div className = "col">

                                        <div className = "d-flex w-100 align-items-center">

                                            <div className = "col">
                                                
                                            </div>

                                            <div className = "col d-flex justify-content-center">
                                                <div className = "row">
                                                    <div className = "col-auto">
                                                        <button className = "btn buttonDefault" onClick = {constButtonToInsertMarketArticle}
                                                        // onClick = {constButtonToInsertMarketArticle} 
                                                        style = {{fontSize : "1.875vh", fontWeight : "bold"}}>게시</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className = "col d-flex justify-content-end">
                                                <div className = "row">
                                                    <div className = "col-auto">
                                                        <button className = "btn buttonCancellationDefault" style = {{fontSize : "1.875vh", fontWeight : "bold"}}>취소</button>
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