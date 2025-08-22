import { useEffect, useRef, useState } from "react";
import MarketFetchMyPhotoOnWriteArticle from "../components/MarketFecthMyPhotoOnWriteArticle";
import useMarketAPI from "../service/MarketService";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import MarketBoardPage from "./MarketBoard";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../../redux/authSlice";
import axios from "axios";

export default function MarketWriteArticlePage() {
    
    // const dispatch = useDispatch();
    
    // //
    
    // const constToken = localStorage.getItem("token");
    
    // if (constToken) {
        
    //     try {
            
    //         const decodedToken = jwtDecode(constToken);
            
    //         console.log("decodedToken : ", decodedToken);
            
    //     } catch (error) {
    //         console.error("Token Error :", error)
    //     }
        
    // } else {
        
    //     console.log("No Token");
        
    // }
    
    // //
    
    // const userId = useSelector(state => state.auth.id);
    
    // console.log(userId);
    
    //
    
    // useEffect (() => {
      
    //     const checkAuth = async () => {
            
    //         console.log("checkAuth is running");
            
    //         const tokenOnCheckAuth =  localStorage.getItem("token");
            
    //         if (!tokenOnCheckAuth) {
                
    //             return;
                
    //         }
            
    //         try {
                
    //             const resOnCheckAuth = await axios.post(
    //                 "http://localhost:8080/api/user/verify-token",
    //                 {},
    //                 { headers: { Authorization: `Bearer ${tokenOnCheckAuth}` } }
    //             );
                
    //             if (resOnCheckAuth.data.success) {
                    
    //                 dispatch(loginAction(resOnCheckAuth.data))
                    
    //                 console.log("resOnCheckAuth.data : ", resOnCheckAuth.data);
                    
    //             }
                
    //         } catch (error) {
                
    //             console.error("checkAuthError", error);
    //             localStorage.removeItem("token");
                
    //         }
            
    //     }
        
    //     checkAuth();
        
    // }, [])
    
    // ▲ 토큰 관련 문제 (나중에 메인 서버에서 받아서 처리할 것)
    
    const checkUserStatus = 1;
    
    const navigate = useNavigate();
    
    const imageLinkRef = useRef(null);
    const titleRef = useRef(null);
    const productCostRef = useRef(null);
    const contentRef = useRef(null);
    
    const [insertImageLink, setInsertImageLink] = useState(null);
    const [previewURL, setPreviewURL] = useState('');
    
    const [insertMarketArticleElement, setInsertMarketArticleElement] = useState(
        {id : 1, marketUserId : checkUserStatus, imageLink : null, imageOriginalFilename : null, mainImageId : 0, 
            title : "", content : "", productCostOption : 0, productCost : "",
            viewedCount : 0, sellEnded : 0, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : null
        }
    )
    
    const marketAPI = useMarketAPI();
    
    const handleDivisionClick = () => {
        
        imageLinkRef.current.click();
        
    }
    
    const constApplyImageLink = (element) => {
        
        const constFile = element.target.files[0];
        
        if (constFile && constFile.type.startsWith('image/')) {
            
            const constInsertImageLink = setInsertImageLink(constFile);
            setPreviewURL(URL.createObjectURL(constFile));
            
        }
        
    }
    
    const constRemoveImageLink = () => {
        
        if (previewURL) {
            
            URL.revokeObjectURL(previewURL);
            
        }
        
        if (imageLinkRef.current) {
            
            imageLinkRef.current.value = null;
            
        }
        
        setInsertImageLink(null);
        setPreviewURL("")
        
    }
    
    const constApplyTextContent = (element) => {
        
        const { name, value } = element.target;
        
        const productCostRegex = /^[0-9]*$/;
        
        //
        
        if (name === "productCost") {
        
            if (productCostRegex.test(value)) {
                
                setInsertMarketArticleElement(insertMarketArticleElement => ({
                    ...insertMarketArticleElement,
                    [name] : value
                }));
            
            } 
            
            else {
                
            }
            
            // ▲ solution 1
            
            //
            
            // const sanitizedValue = value.replace(/[^0-9]/g, '');
            
            // setInsertMarketArticleElement(insertMarketArticleElement => ({
            //     ...insertMarketArticleElement,
            //     [name] : sanitizedValue
            // }));
            
            // ▲ solution 2
            
        } else {
            
            setInsertMarketArticleElement(insertMarketArticleElement => ({
                ...insertMarketArticleElement,
                [name] : value
            }));
            
        }
        
    }
    
    const constButtonToInsertMarketArticle = async (element) => {
        
        const submitArticleData = {
            ...insertMarketArticleElement,
            title : titleRef.current.value,
            productCost : parseInt(productCostRef.current.value || 0, 10),
            content : contentRef.current.value
        };
        
        setInsertMarketArticleElement(submitArticleData);
        
        const submitArticleFormData = new FormData();
        
        if (insertImageLink) {
            
            submitArticleFormData.append('imageLink', insertImageLink);
            
        }
        
        console.log('imageLink');
        console.log(insertImageLink);
        
        submitArticleFormData.append('marketUserId', checkUserStatus);
        submitArticleFormData.append('title', titleRef.current.value);
        submitArticleFormData.append('productCost', parseInt(productCostRef.current.value || 0, 10));
        submitArticleFormData.append('content', contentRef.current.value);
            
        try {
            
            const constPostInsertMarketArticle = await marketAPI.postInsertMarketArticle(submitArticleFormData);
            navigate(`/market`);

            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    useEffect(() => {
        
        if (insertImageLink && previewURL) {
            
            console.log("insertImageLink : ", insertImageLink);
            console.log("previewURL : ", previewURL);
            
        }
        
    }, [insertImageLink, previewURL])
    
    // ▲ 이미지 미리보기 용도
    
    return(
        <>
        
            {/* <Routes>
                <Route path = "/market" element = {<MarketBoardPage />}/>
            </Routes> */}
                            
                <div className = "container-fluid">
                    
                    <div className = "row" style = {{height : "100vh"}}>
                        <div className = "col h-100" style = {{position : "relative"}}>
                            <div className = "col primaryDivisionSizeDefault">
                                <div className = "row" style = {{height : "100%"}}>
                                    <div className = "col primaryDivisionDefault h-100" style = {{position : "relative", overflowX : "hidden", overflowY : "auto"}}>
                                        
                                        <div className = "row">
                                            <div className = "col" style = {{marginBottom : "1rem"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1rem", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                                        사진
                                                    </div>
                                                </div>
                                                
                                                
                                                
                                                <div className = "row">
                                                    <div className = "col" style = {{marginBottom : "0.8125rem"}}>
                                                        <div className = "row gx-0">
                                                            <div className = "col-auto" style = {{width : "6rem", height : "6rem", overflow : "hidden", position : "relative",
                                                            paddingLeft : "0rem", paddingRight : "0rem", border : "1px solid #cccccc", borderRadius : "0.5rem"}}>
                                                                <input type = "file" style = {{display : "none"}} accept = "image*" onChange = {constApplyImageLink} ref = {imageLinkRef} />
                                                                    <div className = "row">
                                                                        <div className = "col basicDivisionOnClickStyle" onClick = {handleDivisionClick}>
                                                                            <MarketFetchMyPhotoOnWriteArticle />
                                                                        </div>
                                                                    </div>
                                                            </div>
                                                            <div className = "col" style = {{padding : "0rem", marginLeft : "0.8125rem",
                                                            border : "1px solid #cccccc", borderRadius : "0.5rem", overflow : "hidden"}}> 
                                                            {/* ui 추후 보완 (어차피 갈아엎어야 되고 기능 구현이 우선. ui 정렬 어떻게 하는지 방법 알고 있음) */}
                                                                <div className = "row gx-0 flex-nowrap">
                                                                    <div className = "col-auto" style = {{width : "5rem", height : "5rem", position : "relative", overflow : "hidden",
                                                                        display: "flex", justifyContent: "center", padding : "0rem", alignItems: "center", marginBottom : "1rem", 
                                                                        border : "1px solid #cccccc", borderRadius : "0.5rem"}}>
                                                                        <img src = {previewURL} style = {{width : "100%", height : "100%", objectFit : "cover"}}/>
                                                                    </div>
                                                                    <div className = "col" style = {{fontSize : "0.75rem"}}>
                                                                        <div className = "row">
                                                                            <div className = "col" style = {{flexGrow : "3", padding : "0rem"}}>
                                                                            </div>
                                                                            <div className = "col" style = {{flexGrow : "8", padding : "0rem"}}>
                                                                                이 사진이
                                                                                <br />
                                                                                대표로 표시되오.
                                                                            </div>
                                                                            <div className = "col" style = {{flexGrow : "3", padding : "0rem"}}>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className = "row">
                                                    <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", position : "relative", overflow : "hidden",
                                                        display: "flex", justifyContent: "center", alignItems: "center", marginBottom : "2.5vh"}}>
                                                        <img src = {previewURL} style = {{width : "100%", height : "100%", objectFit : "cover"}}/>
                                                    </div>
                                                </div> */}
                                                <div className = "row gx-0">
                                                    <div className = "col secondaryDivisionDefault" style = {{fontSize : "0.75rem", paddingTop : "0.3125rem", 
                                                    paddingBottom : "0.3125rem", paddingLeft : "0.8125rem", paddingRight : "0.8125rem", backgroundColor : "#f9f9f9",
                                                    marginBottom : "0.4375rem", height : "3.8125rem", overflowY : "auto"}}>
                                                        {/* 가져온 사진 목록 1 <br />
                                                        가져온 사진 목록 2 <br />
                                                        가져온 사진 목록 3 <br />
                                                        가져온 사진 목록 4 <br /> */}
                                                        {
                                                            insertImageLink ?
                                                            <div className = "row">
                                                                <div className = "col">
                                                                    {insertImageLink.name}
                                                                </div>
                                                                <div className = "col-auto" style = {{fontSize : "0.75rem", fontWeight : "bold", color : "rgb(94, 63, 17)"}}
                                                                onClick = {constRemoveImageLink}>
                                                                    ×
                                                                </div>
                                                            </div>
                                                            :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "0.6125rem", marginTop : "0.3125rem"}}>
                                                        <i className="ri-information-line"></i> 여기에 대표로 표시되는 사진의 이름이 보여지오.
                                                    </div>
                                                </div>
                                                
                                                
                                            </div>
                                        </div>
                                        
                                        <div className = "row">
                                            <div className = "col" style = {{marginBottom : "1rem"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1rem", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                                        제목
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col">
                                                        <input className = "form-control writeArticleTextDivisionDefault" 
                                                        id = "title" name = "title" value = {insertMarketArticleElement.title}
                                                        onChange = {constApplyTextContent} ref = {titleRef}
                                                        style = {{fontSize : "0.75rem"}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className = "row">
                                            <div className = "col" style = {{marginBottom : "1rem"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1rem", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                                        가격 ( 단위 : ￦ )
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col">
                                                        <input className = "form-control writeArticleTextDivisionDefault" 
                                                        id = "productCost" name = "productCost" value = {insertMarketArticleElement.productCost}
                                                        onChange = {constApplyTextContent} ref = {productCostRef}
                                                        style = {{fontSize : "0.75rem"}}/>
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "0.6125rem", marginTop : "0.3125rem"}}>
                                                        <i className="ri-information-line"></i> 0원을 입력하면 나눔 물품으로 게시되오.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className = "row">
                                            <div className = "col" style = {{marginBottom : "1rem"}}>
                                                <div className = "row">
                                                    <div className = "col" style = {{fontSize : "1rem", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                                        내용
                                                    </div>
                                                </div>
                                                <div className = "row">
                                                    <div className = "col">
                                                        <textarea className = "form-control writeArticleTextDivisionDefault" rows = "4"
                                                        id = "content" name = "content" value = {insertMarketArticleElement.content}
                                                        onChange = {constApplyTextContent} ref = {contentRef}
                                                        style = {{fontSize : "0.75rem", resize : "none"}}/>
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
                                                                style = {{fontSize : "0.75rem", fontWeight : "bold"}}>게시</button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className = "col d-flex justify-content-end">
                                                        <div className = "row">
                                                            <div className = "col-auto">
                                                                <button className = "btn buttonCancellationDefault" onClick = {() => navigate(-1)}
                                                                style = {{fontSize : "0.75rem", fontWeight : "bold"}}>취소</button>
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
                    
                </div>
        
        </>
    )
    
}