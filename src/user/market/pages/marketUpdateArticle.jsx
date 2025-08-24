import { useEffect, useRef, useState } from "react";
import MarketFetchMyPhotoOnWriteArticle from "../components/MarketFecthMyPhotoOnWriteArticle";
import useMarketAPI from "../service/MarketService";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loginAction } from "../../../redux/authSlice";

function ImageWarningModal({open, onClose, onConfirm}) {
    
    if (!open) {
        
        return null;
        
    }
    
    return(
        <>
        
            <div role = "dialog" aria-modal = "true" onClick = {onClose}
            style = {{position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "16px"}}>
                <div onClick={(e) => e.stopPropagation()}
                style={{width: "100%", maxWidth: 330, background: "#fff", borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,.18)", padding: "25px 18px", textAlign: "center"}}>
                    <div className = "row">
                        <div className = "col" style = {{paddingTop : "0.5rem", paddingBottom : "0.5rem"}}>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.5rem", color : "#c0392b", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                    잠깐!
                                </div>
                            </div>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.125rem", marginBottom : "1.25rem"}}>
                                    정말 이대로 게시하겠소?
                                    <br />
                                    물건 파악의 원활함을 위해
                                    <br />
                                    이미지 업로드를 권하오.
                                </div>
                            </div>
                            <div className = "row">
                                <div className = "col">
                                    <div className = "row">
                                        <div className = "col">
                                            <button className = "btn buttonDefault" onClick = {onConfirm}
                                            style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingTop : "0.75rem", paddingBottom : "0.75rem", marginBottom : "0.5rem"}}>그래도 게시하기</button>
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col">
                                            <button className = "btn buttonCancellationDefault" onClick={onClose}
                                            style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingTop : "0.75rem", paddingBottom : "0.75rem"}}>돌아가기</button>
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

export default function MarketUpdateArticlePage() {
    
    const {id : loadedId} = useParams()
    
    const dispatch = useDispatch();
    
    //
    
    const constToken = localStorage.getItem("token");
    
    if (constToken) {
        
        try {
            
            const decodedToken = jwtDecode(constToken);
            
            console.log("decodedToken : ", decodedToken);
            
        } catch (error) {
            console.error("Token Error :", error)
        }
        
    } else {
        
        console.log("No Token");
        
    }
    
    //
    
    const userId = useSelector(state => state.auth.id);
    
    console.log(userId);
    
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
    
    // ▲ 토큰 관련 문제 (나중에 메인 서버에서 받아서 처리할 것)
    
    const checkUserStatus = userId;
    const checkArticleId = Number(loadedId);
    
    const navigate = useNavigate();
    
    const BACKEND_BASE_URL = "http://localhost:8080";
    
    const [doesImageWarningModalOpened, setDoesImageWarningModalOpened] = useState(false);
    
    const handleConfirmOfImageWarningModal = () => {
        
        console.log("Modal Process Completed!");
        setDoesImageWarningModalOpened(false);
        
    }
    
    const imageLinkRef = useRef(null);
    const titleRef = useRef(null);
    const productCostRef = useRef(null);
    const contentRef = useRef(null);
    
    const [updateImageLink, setUpdateImageLink] = useState(null);
    const [previewURL, setPreviewURL] = useState('');
    const [displayImageName, setDisplayImageName] = useState(null);
    
    const [updateMarketArticleElement, setUpdateMarketArticleElement] = useState(
        {id : 0, marketUserId : checkUserStatus, imageLink : null, imageOriginalFilename : null, mainImageId : -1, 
            title : "ERROR", content : "ERROR", productCostOption : -1, productCost : -1,
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : null
        }
    )
    
    console.log("updateMarketArticleElement");
    console.log(updateMarketArticleElement);
    
    console.log("updateImageLink : ", updateImageLink);
    console.log("previewURL : ", previewURL);
            
    const marketAPI = useMarketAPI();
    
    const handleDivisionClick = () => {
        
        imageLinkRef.current.click();
        
    }
    
    const constApplyImageLink = (element) => {
        
        const constFile = element.target.files[0];
        
        if (constFile && constFile.type.startsWith('image/')) {
            
            const constUpdateImageLink = setUpdateImageLink(constFile);
            setPreviewURL(URL.createObjectURL(constFile));
            setDisplayImageName(constFile.name);
                
        }
        
    }
    
    const constRemoveImageLink = () => {
        
        if (previewURL) {
            
            URL.revokeObjectURL(previewURL);
            
        }
        
        if (imageLinkRef.current) {
            
            imageLinkRef.current.value = null;
            
        }
        
        setUpdateImageLink(null);
        setPreviewURL("");
        setDisplayImageName(null);
        
    }
    
    const constApplyTextContent = (element) => {
        
        const { name, value } = element.target;
        
        const productCostRegex = /^[0-9]*$/;
        
        //
        
        if (name === "productCost") {
        
            if (productCostRegex.test(value)) {
                
                setUpdateMarketArticleElement(updateMarketArticleElement => ({
                    ...updateMarketArticleElement,
                    [name] : value
                }));
            
            } 
            
            else {
                
            }
            
        } else {
            
            setUpdateMarketArticleElement(updateMarketArticleElement => ({
                ...updateMarketArticleElement,
                [name] : value
            }));
            
        }
        
    }
    
    const constButtonToUpdateMarketArticle = async (element) => {
        
        const submitArticleData = {
            ...updateMarketArticleElement,
            title : titleRef.current.value,
            productCost : productCostRef.current.value,
            content : contentRef.current.value
        };
        
        setUpdateMarketArticleElement(submitArticleData);
        
        const submitArticleFormData = new FormData();
        
        if (updateImageLink) {
            
            submitArticleFormData.append('imageLink', updateImageLink);
            
        }
        
        console.log('imageLink');
        console.log(updateImageLink);
        
        submitArticleFormData.append('id', checkArticleId);
        submitArticleFormData.append('marketUserId', checkUserStatus);
        submitArticleFormData.append('title', titleRef.current.value);
        submitArticleFormData.append('productCost', productCostRef.current.value);
        submitArticleFormData.append('content', contentRef.current.value);
            
        try {
            
            const constPostUpdateMarketArticle = await marketAPI.postUpdateMarketArticle(submitArticleFormData);
            navigate(`/market/article/${checkArticleId}`);

            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    useEffect(() => {
        
        const constUseEffect = async () => {
                
            console.log("Loading Test Start");
            
            try {
                
                const constGetSelectSpecificMarketArticle = await marketAPI.getSelectSpecificMarketArticle(checkArticleId);
                
                setUpdateMarketArticleElement(constGetSelectSpecificMarketArticle);
                
                if (constGetSelectSpecificMarketArticle.imageLink) {
                    
                    const constUpdateImageLinkURL = `${BACKEND_BASE_URL}${constGetSelectSpecificMarketArticle.imageLink}`
                    // setUpdateImageLink(constGetSelectSpecificMarketArticle.imageLink);
                    setDisplayImageName(constGetSelectSpecificMarketArticle.imageOriginalFilename);
                    setPreviewURL(constUpdateImageLinkURL);
                    
                }
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            } finally {
                
                // No Process Needed
                
            }
            
        }
        
        constUseEffect();
        
    }, [])
    
    useEffect(() => {
        
        if (updateImageLink && previewURL) {
            
            console.log("updateImageLink : ", updateImageLink);
            console.log("previewURL : ", previewURL);
            
        }
        
    }, [updateImageLink, previewURL])
    
    return(
        <>
                            
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
                                                        
                                                        {/* <div className = "col-auto" style = {{marginLeft : "0.8125rem", display : "flex", flexDirection : "column",
                                                        border : "1px solid #cccccc", borderRadius : "0.5rem", overflow : "hidden", alignItems : "center",
                                                        paddingLeft : "2rem", paddingRight : "2rem"}}>  */}
                                                        {/* ui 추후 보완 (어차피 갈아엎어야 되고 기능 구현이 우선. ui 정렬 어떻게 하는지 방법 알고 있음) */}
                                                            {/* <div className = "row">
                                                                <div className = "col" style = {{fontSize : "0.75rem"}}>
                                                                    이 사진이 대표로 표시되오.
                                                                </div>
                                                            </div> */}
                                                            {/* <div className = "row h-100 gx-0 flex-nowrap align-items-center"> */}
                                                            
                                                            {
                                                                (updateImageLink || displayImageName) ?
                                                                <div className = "col-auto" style = {{width : "6rem", height : "6rem", position : "relative", overflow : "hidden",
                                                                    display: "flex", justifyContent: "center", padding : "0rem", alignItems: "center", marginBottom : "0rem", 
                                                                    marginLeft : "1rem", marginRight : "1rem",
                                                                    border : "1px solid #cccccc", borderRadius : "0.5rem"}}>
                                                                    <img src = {previewURL} style = {{width : "100%", height : "100%", objectFit : "cover"}}/>
                                                                </div>
                                                                :
                                                                <></>
                                                            }
                                                            
                                                                {/* <div className = "col h-100" style = {{fontSize : "0.75rem", textAlign : "center",
                                                                display : "flex", justifyContent : "center", alignItems : "center"}}>
                                                                    이 사진이
                                                                    <br />
                                                                    대표로 표시되오.
                                                                </div> */}
                                                            {/* </div> */}
                                                        {/* </div> */}
                                                        
                                                        {/* <div className = "col" style = {{padding : "0rem", marginLeft : "0.8125rem",
                                                        border : "1px solid #cccccc", borderRadius : "0.5rem", overflow : "hidden"}}> 
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
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className = "row gx-0">
                                                <div className = "col secondaryDivisionDefault" style = {{fontSize : "0.75rem", paddingTop : "0.3125rem", 
                                                paddingBottom : "0.3125rem", paddingLeft : "0.8125rem", paddingRight : "0.8125rem", backgroundColor : "#f9f9f9",
                                                marginBottom : "0.4375rem", height : "3.8125rem", overflowY : "auto"}}>
                                                    {/* {
                                                        updateImageLink ?
                                                        <div className = "row">
                                                            <div className = "col">
                                                                {updateImageLink.name}
                                                            </div>
                                                            <div className = "col-auto" style = {{fontSize : "1.75vh", fontWeight : "bold", color : "rgb(94, 63, 17)"}}
                                                            onClick = {constRemoveImageLink}>
                                                                ×
                                                            </div>
                                                        </div>
                                                        :
                                                        <></>
                                                    } */}
                                                    {
                                                        displayImageName ?
                                                        <div className = "row">
                                                            <div className = "col">
                                                                {displayImageName}
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
                                                    {/* <i className="ri-information-line"></i> 여기에 대표로 표시되는 사진의 이름이 보여지오. */}
                                                </div>
                                            </div>
                                            
                                            
                                            
                                            
                                            {/* <div className = "row">
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
                                            </div> */}
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
                                                    id = "title" name = "title" value = {updateMarketArticleElement.title}
                                                    onChange = {constApplyTextContent} ref = {titleRef}
                                                    style = {{fontSize : "0.875rem"}}/>
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
                                                    id = "productCost" name = "productCost" value = {updateMarketArticleElement.productCost}
                                                    onChange = {constApplyTextContent} ref = {productCostRef}
                                                    style = {{fontSize : "0.875rem"}}/>
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "0.75rem", marginTop : "0.3125rem"}}>
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
                                                    id = "content" name = "content" value = {updateMarketArticleElement.content}
                                                    onChange = {constApplyTextContent} ref = {contentRef}
                                                    style = {{fontSize : "0.875rem", resize : "none"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "1rem"}}>

                                            <div className = "d-flex w-100 align-items-center">
                                                
                                                <ImageWarningModal open = {doesImageWarningModalOpened}
                                                onClose = {() => setDoesImageWarningModalOpened(false)}
                                                onConfirm = {constButtonToUpdateMarketArticle} />
                                                
                                                {(updateImageLink || displayImageName) ?

                                                    <div className = "col d-flex justify-content-center">
                                                        <div className = "row">
                                                            <div className = "col-auto">
                                                                <button className = "btn buttonDefault" onClick = {constButtonToUpdateMarketArticle}
                                                                style = {{fontSize : "0.9375rem", fontWeight : "bold"}}>수정</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    :
                                                    
                                                    <div className = "col d-flex justify-content-center">
                                                        <div className = "row">
                                                            <div className = "col-auto">
                                                                <button className = "btn buttonDefault" onClick = {() => setDoesImageWarningModalOpened(true)}
                                                                style = {{fontSize : "0.9375rem", fontWeight : "bold"}}>수정</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                
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

//

// export default function MarketUpdateArticlePage() {
    
//     const [updateMarketArticleElement, setUpdateMarketArticleElement] = useState(
//         {id : 1, marketUserId : 1004, imageLink : null, mainImageId : 0, title : "My Neck", content : "My Dragon", productCostOption : 0, productCost : 0,
//             viewedCount : 0, sellEnded : 0, createdAt : "1970-01-01T00:00:01", updatedAt : null
//         }
//     )
    
//     const marketAPI = useMarketAPI();
    
//     const constButtonToUpdateMarketArticle = async () => {
            
//             try {
//                 const constPostUpdateMarketArticle = await marketAPI.postUpdateMarketArticle(updateMarketArticleElement);
//                 console.log(constPostUpdateMarketArticle);
//             } catch (error) {
//                 console.error("로드 실패:", error);
//             }
            
//         }
    
//     return(
//         <>
        
//             <div className = "container-fluid">
                
//                 <div className = "row">
//                     <div className = "col primaryDivisionDefault" style = {{ height : "80vh", overflowX : "hidden"}}>
                        
//                         <div className = "row">
//                             <div className = "col" style = {{marginBottom : "2.5vh"}}>
//                                 <div className = "row">
//                                     <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
//                                         사진
//                                     </div>
//                                 </div>
//                                 <div className = "row">
//                                     <div className = "col" style = {{marginBottom : "2vh"}}>
//                                         <div className = "row gx-0">
//                                             <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
//                                             paddingLeft : "0vh", paddingRight : "0vh", border : "0.25vh solid rgb(192, 192, 192)", borderRadius : "1.25vh"}}>
//                                                 <MarketFetchMyPhotoOnWriteArticle />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className = "row gx-0">
//                                     <div className = "col secondaryDivisionDefault" style = {{fontSize : "1.75vh", paddingTop : "0.75vh", paddingBottom : "0.75vh", paddingLeft : "2vh", paddingRight : "2vh", 
//                                     marginBottom : "1vh", height : "9.5vh", overflowY : "auto"}}>
//                                         가져온 사진 목록 1 <br />
//                                         가져온 사진 목록 2 <br />
//                                         가져온 사진 목록 3 <br />
//                                         가져온 사진 목록 4 <br />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className = "row">
//                             <div className = "col" style = {{marginBottom : "2.5vh"}}>
//                                 <div className = "row">
//                                     <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
//                                         제목
//                                     </div>
//                                 </div>
//                                 <div className = "row">
//                                     <div className = "col">
//                                         <input className = "form-control writeArticleTextDivisionDefault" style = {{fontSize : "1.75vh"}}/>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className = "row">
//                             <div className = "col" style = {{marginBottom : "2.5vh"}}>
//                                 <div className = "row">
//                                     <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
//                                         가격
//                                     </div>
//                                 </div>
//                                 <div className = "row">
//                                     <div className = "col">
//                                         <input className = "form-control writeArticleTextDivisionDefault" style = {{fontSize : "1.75vh"}}/>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className = "row">
//                             <div className = "col" style = {{marginBottom : "2.5vh"}}>
//                                 <div className = "row">
//                                     <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
//                                         내용
//                                     </div>
//                                 </div>
//                                 <div className = "row">
//                                     <div className = "col">
//                                         <textarea className = "form-control writeArticleTextDivisionDefault" style = {{fontSize : "1.75vh"}}/>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className = "row">
//                             <div className = "col">

//                                 <div className = "d-flex w-100 align-items-center">

//                                     <div className = "col">
                                        
//                                     </div>

//                                     <div className = "col d-flex justify-content-center">
//                                         <div className = "row">
//                                             <div className = "col-auto">
//                                                 <button className = "btn buttonDefault" onClick = {constButtonToUpdateMarketArticle} style = {{fontSize : "1.875vh", fontWeight : "bold"}}>게시</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className = "col d-flex justify-content-end">
//                                         <div className = "row">
//                                             <div className = "col-auto">
//                                                 <button className = "btn buttonCancellationDefault" style = {{fontSize : "1.875vh", fontWeight : "bold"}}>취소</button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
                        
//                     </div>
//                 </div>
                
//             </div>
        
//         </>
//     )
    
// }

// ▲ app.jsx 수정 전 및 writearticle 페이지 구조 변경 전 기존 updatearticle 페이지