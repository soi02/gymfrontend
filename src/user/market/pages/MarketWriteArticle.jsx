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
    
    useEffect (() => {
      
        const checkAuth = async () => {
            
            console.log("checkAuth is running");
            
            const tokenOnCheckAuth =  localStorage.getItem("token");
            
            if (!tokenOnCheckAuth) {
                
                return;
                
            }
            
            try {
                
                const resOnCheckAuth = await axios.post(
                    "http://localhost:8080/api/user/verify-token",
                    {},
                    { headers: { Authorization: `Bearer ${tokenOnCheckAuth}` } }
                );
                
                if (resOnCheckAuth.data.success) {
                    
                    dispatch(loginAction(resOnCheckAuth.data))
                    
                    console.log("resOnCheckAuth.data : ", resOnCheckAuth.data);
                    
                }
                
            } catch (error) {
                
                console.error("checkAuthError", error);
                localStorage.removeItem("token");
                
            }
            
        }
        
        checkAuth();
        
    }, [])
    
    //
    
    const checkUserStatus = 2;
    
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
                                                    <div className = "col-auto" style = {{width : "15vh", height : "15vh", overflow : "hidden", position : "relative",
                                                    paddingLeft : "0vh", paddingRight : "0vh", border : "0.25vh solid rgb(192, 192, 192)", borderRadius : "1.25vh"}}>
                                                        <input type = "file" style = {{display : "none"}} accept = "image*" onChange = {constApplyImageLink} ref = {imageLinkRef} />
                                                            <div className = "row">
                                                                <div className = "col basicDivisionOnClickStyle" onClick = {handleDivisionClick}>
                                                                    <MarketFetchMyPhotoOnWriteArticle />
                                                                </div>
                                                            </div>
                                                    </div>
                                                    <div className = "col" style = {{padding : "0vh", marginLeft : "2vh", marginRight : "2vh", 
                                                    border : "0.25vh solid rgb(192, 192, 192)", borderRadius : "1.25vh", overflow : "hidden"}}> 
                                                    {/* ui 추후 보완 (어차피 갈아엎어야 되고 기능 구현이 우선. ui 정렬 어떻게 하는지 방법 알고 있음) */}
                                                        <div className = "row gx-0 flex-nowrap">
                                                            <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", position : "relative", overflow : "hidden",
                                                                display: "flex", justifyContent: "center", padding : "0vh", alignItems: "center", marginBottom : "2.5vh", 
                                                                border : "0.25vh solid rgb(192, 192, 192)", borderRadius : "1.25vh"}}>
                                                                <img src = {previewURL} style = {{width : "100%", height : "100%", objectFit : "cover"}}/>
                                                            </div>
                                                            <div className = "col" style = {{fontSize : "1.75vh"}}>
                                                                <div className = "row">
                                                                    <div className = "col" style = {{flexGrow : "3", padding : "0vh"}}>
                                                                    </div>
                                                                    <div className = "col" style = {{flexGrow : "8", padding : "0vh"}}>
                                                                        대표 사진으로 
                                                                        <br />
                                                                        표시됩니다.
                                                                    </div>
                                                                    <div className = "col" style = {{flexGrow : "3", padding : "0vh"}}>
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
                                            <div className = "col secondaryDivisionDefault" style = {{fontSize : "1.75vh", paddingTop : "0.75vh", paddingBottom : "0.75vh", paddingLeft : "2vh", paddingRight : "2vh", 
                                            marginBottom : "1vh", height : "9.5vh", overflowY : "auto"}}>
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
                                                        <div className = "col-auto" style = {{fontSize : "1.75vh", fontWeight : "bold", color : "rgb(94, 63, 17)"}}
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
                                            <div className = "col" style = {{fontSize : "1.5vh", marginTop : "0.75vh"}}>
                                                <i className="ri-information-line"></i> 선택한 사진이 대표 사진으로 표시됩니다.
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
                                                <textarea className = "form-control writeArticleTextDivisionDefault" rows = "4"
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
                                                        style = {{fontSize : "1.875vh", fontWeight : "bold"}}>게시</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className = "col d-flex justify-content-end">
                                                <div className = "row">
                                                    <div className = "col-auto">
                                                        <button className = "btn buttonCancellationDefault" onClick = {() => navigate(-1)}
                                                        style = {{fontSize : "1.875vh", fontWeight : "bold"}}>취소</button>
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