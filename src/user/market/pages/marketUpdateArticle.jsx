import { useEffect, useRef, useState } from "react";
import MarketFetchMyPhotoOnWriteArticle from "../components/MarketFecthMyPhotoOnWriteArticle";
import useMarketAPI from "../service/MarketService";
import { useNavigate, useParams } from "react-router-dom";

export default function MarketUpdateArticlePage() {
    
    const {id : loadedId} = useParams()
    
    const checkUserStatus = 1;
    const checkArticleId = Number(loadedId);
    
    const navigate = useNavigate();
    
    const BACKEND_BASE_URL = "http://localhost:8080";
    
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
                                                paddingLeft : "0vh", paddingRight : "0vh", border : "1px solid #cccccc", borderRadius : "1.25vh"}}>
                                                    <input type = "file" style = {{display : "none"}} accept = "image*" onChange = {constApplyImageLink} ref = {imageLinkRef} />
                                                        <div className = "row">
                                                            <div className = "col basicDivisionOnClickStyle" onClick = {handleDivisionClick}>
                                                                <MarketFetchMyPhotoOnWriteArticle />
                                                            </div>
                                                        </div>
                                                </div>
                                                <div className = "col" style = {{padding : "0vh", marginLeft : "2vh",
                                                border : "1px solid #cccccc", borderRadius : "1.25vh", overflow : "hidden"}}> 
                                                    <div className = "row gx-0 flex-nowrap">
                                                        <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", position : "relative", overflow : "hidden",
                                                            display: "flex", justifyContent: "center", padding : "0vh", alignItems: "center", marginBottom : "2.5vh", 
                                                            border : "1px solid #cccccc", borderRadius : "1.25vh"}}>
                                                            <img src = {previewURL} style = {{width : "100%", height : "100%", objectFit : "cover"}}/>
                                                        </div>
                                                        <div className = "col" style = {{fontSize : "1.75vh"}}>
                                                            <div className = "row">
                                                                <div className = "col" style = {{flexGrow : "3", padding : "0vh"}}>
                                                                </div>
                                                                <div className = "col" style = {{flexGrow : "8", padding : "0vh"}}>
                                                                    대표로 표시되는 
                                                                    <br />
                                                                    사진이오.
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
                                    <div className = "row gx-0">
                                        <div className = "col secondaryDivisionDefault" style = {{fontSize : "1.75vh", paddingTop : "0.75vh", 
                                        paddingBottom : "0.75vh", paddingLeft : "2vh", paddingRight : "2vh", backgroundColor : "#f9f9f9",
                                        marginBottom : "1vh", height : "9.5vh", overflowY : "auto"}}>
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
                                <div className = "col" style = {{marginBottom : "2.5vh"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{fontSize : "2.5vh", fontWeight : "bold", marginBottom : "1.25vh"}}>
                                            제목
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col">
                                            <input className = "form-control writeArticleTextDivisionDefault" 
                                            id = "title" name = "title" value = {updateMarketArticleElement.title}
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
                                            id = "productCost" name = "productCost" value = {updateMarketArticleElement.productCost}
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
                                            id = "content" name = "content" value = {updateMarketArticleElement.content}
                                            onChange = {constApplyTextContent} ref = {contentRef}
                                            style = {{fontSize : "1.75vh", resize : "none"}}/>
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
                                                    <button className = "btn buttonDefault" onClick = {constButtonToUpdateMarketArticle}
                                                    style = {{fontSize : "1.875vh", fontWeight : "bold"}}>수정</button>
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