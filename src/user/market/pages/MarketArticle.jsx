import { useEffect, useRef, useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductImageOnArticle from "../components/test/example/MarketProductImageOnArticle";
import '../styles/MarketCommonStyles.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import useMarketAPI from "../service/MarketService";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loginAction } from "../../../redux/authSlice";

function SelectBuyerWarningModal({open, onClose, onConfirm}) {
    
    if (open !== true) {
        
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
                                <div className = "col" style = {{fontSize : "1.375rem", color : "#c0392b", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                    잠깐!
                                </div>
                            </div>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.062rem", marginBottom : "1.25rem"}}>
                                    구매인 선택을 신중히 해 주시오.
                                    <br />
                                    한번 선택한 구매인은
                                    <br />
                                    취소 및 변경이 불가능하오.
                                </div>
                            </div>
                            <div className = "row">
                                <div className = "col">
                                    <div className = "row">
                                        <div className = "col">
                                            <button className = "btn buttonDefault" onClick = {onConfirm}
                                            style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingTop : "0.75rem", paddingBottom : "0.75rem", marginBottom : "0.5rem"}}>선택하기</button>
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

function SelectSellerWarningModal({open, onClose, onConfirm}) {
    
    if (!open) {
        
        return null;
        
    } else {
    
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
                                    <div className = "col" style = {{fontSize : "1.375rem", color : "#c0392b", fontWeight : "bold", marginBottom : "0.5rem"}}>
                                        잠깐!
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "1.062rem", marginBottom : "1.25rem"}}>
                                        판매인 선택을 신중히 해 주시오.
                                        <br />
                                        한번 선택한 판매인은
                                        <br />
                                        취소 및 변경이 불가능하오.
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col">
                                        <div className = "row">
                                            <div className = "col">
                                                <button className = "btn buttonDefault" onClick = {onConfirm}
                                                style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingTop : "0.75rem", paddingBottom : "0.75rem", marginBottom : "0.5rem"}}>선택하기</button>
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
    
}

export default function MarketArticlePageTest() {
    
    const BACKEND_BASE_URL = "http://localhost:8080";
    
    const {id : loadedId} = useParams();
    
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
    console.log("checkArticleId");
    console.log(checkArticleId);
    const defaultUserStatus = 1004;
    
    // const [ ids ]
    
    const [ articleSellerCheckedByBuyer, setArticleSellerCheckedByBuyer ] = useState(false);
    
    const [ dealConfirmCompleted, setDealConfirmCompleted ] = useState(false);
    // 이게 완료됐을 시, 판매자 체크 및 구매자 체크 탭은 별도로 표시하지 않음
    console.log("dealConfirmCompleted");
    console.log(dealConfirmCompleted);
    
    const [countOfInterestedLogsOnArticle, setCountOfInterestedLogsOnArticle] = useState(-1);
    const [countOfCommentOnArticle, setCountOfCommentOnArticle] = useState(-1);
    
    const navigate = useNavigate();
    
    const [isBuyerWarningModalOpened, setIsBuyerWarningModalOpened] = useState(false);
    const [isSellerWarningModalOpened, setIsSellerWarningModalOpened] = useState(false);
    
    


    
    
    const contentRef = useRef(null);
    
    const [mergeMarketArticleInfo, setMergeMarketArticleInfo] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : null, imageOriginalFilename : null, mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, name : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ])

    console.log("mergeMarketArticleInfo");
    console.log(mergeMarketArticleInfo);
    
    const imageLinkPath = mergeMarketArticleInfo[0]?.article?.imageLink;
    
    const imageLinkURL = new URL(imageLinkPath ?? "", BACKEND_BASE_URL).toString();
    // `${BACKEND_BASE_URL}${imageLinkPath}`;
    
    
    
    const [checkArticleWriteUser, setCheckArticleWriteUser] = useState(0);
    
    console.log("checkArticleWriteUser");
    console.log(checkArticleWriteUser);
    
    const [ checkUserDealerStatus, setCheckUserDealerStatus ] = useState(0);
    // checkUserDealerStatus 가 1 일 땐 Seller 상태, 2 일 땐 Buyer 상태
    
    console.log("checkUserDealerStatus");
    console.log(checkUserDealerStatus);
    
    const [ dealerCheckDivisionActivate, setDealerCheckDivisionActivate ] = useState(true);
    // const [] = useState();
    
    console.log("dealerCheckDivisionActivate");
    console.log(dealerCheckDivisionActivate);
    
    const constMarketArticleElement = mergeMarketArticleInfo.map(mergedElement => (
    <MarketArticleElement key = {mergedElement?.article?.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleUpdateOrDeleteDivisionPageLayout = mergeMarketArticleInfo.map(mergedElement => (
    <MarketArticleUpdateOrDeleteDivisionPageLayout key = {mergedElement?.article?.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketBuyerOrSellerCheckedInformationOnArticleDivisionPageLayout = mergeMarketArticleInfo.map(mergedElement => (
    <MarketBuyerOrSellerCheckedInformationOnArticleDivisionPageLayout key = {mergedElement?.article?.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleLikeButtonPageLayout = mergeMarketArticleInfo.map(mergedElement => (
    <MarketArticleLikeButtonPageLayout key = {mergedElement?.article?.id} marketArticleElem1 = {mergedElement}/>));
    
    const [marketProductDealedLogCheckedBySeller, setMarketProductDealedLogCheckedBySeller] = useState({})
    
    const [marketProductDealedLogCheckedByBuyer, setMarketProductDealedLogCheckedByBuyer] = useState({})
    
    const [marketProductDealedLog, setMarketProductDealedLog] = useState({})
    
    const [marketProductInterestedLogOnArticle, setMarketProductInterestedLogOnArticle] = useState([
        {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
    ])
    
    const [mergeMarketProductInterestedLogOnArticle, setMergeMarketProductInterestedLogOnArticle] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : null, imageOriginalFilename : null, mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, name : "ERROR", createdAt : new Date("1970-01-01T00:00:00")},
            interestInfo : {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
            
        }
    ])
    
    const [insertMarketProductInterestedLog, setInsertMarketProductInterestedLog] = useState(
        {id : 1, marketUserId : checkUserStatus, specificArticleId : checkArticleId, createdAt : new Date("1970-01-01T00:00:03")}
    )
    
    const constMarketProductInterestedLogElement = mergeMarketProductInterestedLogOnArticle
    .filter(element => element?.interestInfo?.specificArticleId === checkArticleId && element?.interestInfo?.marketUserId === checkUserStatus)
    .map(element => <MarketProductInterestedLogElementOnArticleWhenExists key = {element?.interestInfo?.id} marketArticleElem1 = {element}/>)
    
    console.log("mergeMarketProductInterestedLogOnArticle");
    console.log(mergeMarketProductInterestedLogOnArticle);
    console.log("constMarketProductInterestedLogElement");
    console.log(constMarketProductInterestedLogElement);
    
    const [mergeMarketCommentListOnArticle, setMergeMarketCommentListOnArticle] = useState([
        {
            
            comment : {id : 0, articleId : 0, marketUserId : 0, content : "ERROR", createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null},
            userInfo : {id : 0, userId : 0, name : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ]);
    
    //
    
    // const marketCommentListOnArticleBeforeLoad = [
    //     {id : 0, articleId : 0, marketUserId : 0, content : "ERROR", 
    //     createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null},
    // ] 
    
    // const marketUserInfoListOnCommentOnArticleBeforeLoad = [
    //     {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    // ]
    
    // ▲ 안 쓰는 방식의 코드
    
    const [reloadingProductInterestedLogWhenUserAndArticleInfo, setReloadingProductInterestedLogWhenUserAndArticleInfo] = useState(false);
    const [commentOnArticleLoading, setCommentOnArticleLoading] = useState(true);
    const [commentOnArticleReloading, setCommentOnArticleReloading] = useState(false);
    const [reloadingDealerCheckDivisionActivate, setReloadingDealerCheckDivisionActivate] = useState(false);
    
    //
    
    // const mergedListOnCommentOnArticleBeforeLoad = marketCommentListOnArticleBeforeLoad.map(comment => {
    //     const userInfo = marketUserInfoListOnCommentOnArticleBeforeLoad.find(user => user.userId === comment.marketUserId);
    //     return { comment, userInfo };
    // });
    
    // ▲ 안 쓰는 방식의 코드
    
    const handleEditMode = (targetId) => {
        
        
        
    } 
    
    const handleUpdateComment = async (newElement, targetId, newContent) => {

        console.log("newElement");
        console.log(newElement);
        console.log("targetId");
        console.log(targetId);
        console.log("newContent");
        console.log(newContent);
        
        const targetElement = newElement;
        
        // const targetElement = newElement.find(
        //     element => {
                
        //         console.log("elemtest1")
        //         console.log(element?.comment?.id)
        //         console.log("targetId")
        //         console.log(targetId)
                
        //         element?.comment?.id === targetId
                
        //     }
        // );
        
        
        console.log("targetElement");
        console.log(targetElement);
        
        const submitUpdateCommentData = {
            ...targetElement.comment,
            content : newContent
        };
        console.log("submitUpdateCommentData");
        console.log(submitUpdateCommentData);
        
        try {
            
            // const [ constPostUpdateSpecificMarketCommentOnArticle, constGetSelectSpecificMarketCommentOnArticle ] = await Promise.all([
            //     marketAPI.postUpdateMarketCommentOnArticle(submitUpdateCommentData),
            //     marketAPI.getSelectSpecificMarketCommentOnArticle(submitUpdateCommentData.id)
            // ])
            
            const constPostUpdateSpecificMarketCommentOnArticle = await marketAPI.postUpdateMarketCommentOnArticle(submitUpdateCommentData);
            const constGetSelectSpecificMarketCommentOnArticle = await marketAPI.getSelectSpecificMarketCommentOnArticle(submitUpdateCommentData.id);
            
            const constGetSelectSpecificMarketCommentElementOnArticle = {
                comment : constGetSelectSpecificMarketCommentOnArticle.marketCommentOnArticleDto,
                userInfo : constGetSelectSpecificMarketCommentOnArticle.marketUserInfoDto
            }
            
            setMergeMarketCommentListOnArticle(currentList =>
                currentList.map(element => {
                    
                    if (element?.comment?.id === submitUpdateCommentData.id) {
                        
                        return constGetSelectSpecificMarketCommentElementOnArticle; 
                    }
                    
                    return element;
                })
            );
            
            console.log("constGetSelectSpecificMarketCommentElementOnArticle");
            console.log(constGetSelectSpecificMarketCommentElementOnArticle);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constmarketCommentElementListOnArticle = mergeMarketCommentListOnArticle
    .map(mergedElement => {
        
        return(
        <MarketCommentElementOnArticle key = {mergedElement?.comment?.id} marketCommentElem1 = {mergedElement} onUpdateConfirm = {handleUpdateComment}/>
        )
        
    });
    
    const insertMarketCommentOnArticleElementDefaultValue =
        {id : 1, articleId : checkArticleId, marketUserId : checkUserStatus, content : "", 
        createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null};
    
    const [insertMarketCommentOnArticleElement, setInsertMarketCommentOnArticleElement] = useState(
        {id : 1, articleId : checkArticleId, marketUserId : checkUserStatus, content : "", 
        createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null}
    );
    
    const [mergeMarketCommentEditElementListOnArticle, setMergeMarketCommentEditElementListOnArticle] = useState([
        {
            
            comment : {id : 0, articleId : 0, marketUserId : 0, content : "ERROR", createdAt : new Date("1970-01-01T00:00:03"),  updatedAt : new Date("1970-01-01T00:00:04")},
            userInfo : {id : 0, userId : 0, name : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ]);
    
    const constApplyTextContentOnComment = (targetId, newContent) => {
        
        setMergeMarketCommentEditElementListOnArticle(currentList => 
            
            currentList.map(element => {
                
                if (element?.comment?.id !== targetId) {
                    
                    return element;
                    
                } else {
                    
                    return {
                        
                        ...element,
                        comment : {
                            
                            ...element?.comment,
                            content : newContent
                            
                        }
                        
                    }
                    
                }
                
            })
            
        );
        
    }
    
    const constButtonToUpdateMarketCommentOnArticle = async (element1) => {
        
        const submitCommentOnArticleData = {
            ...mergeMarketCommentEditElementListOnArticle,
            content : updateCommentRef.current.value
        }
        
        setMergeMarketCommentEditElementListOnArticle(submitCommentOnArticleData);
        
        try {
            
            const constPostUpdateMarketCommentOnArticle = await marketAPI.postUpdateMarketCommentOnArticle(mergeMarketCommentEditElementListOnArticle);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
        setCommentEditModeChecked(false); // 자식 요소에 직접 접근해서 바꿔야 됨
        
    }
    
    const marketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
                try {
                    
                console.log("Loading Test Start") // Reload 코드 그대로 불러와서... (Finally 시 처리는 다른데...) 수정해야 됨....
                
                const [ constGetSelectSpecificMarketArticleInfo, constGetSelectMarketUserInfo, constGetSelectMarketCommentOnArticle, constGetSelectCountMarketProductInterestedLogWhenArticleInfo, 
                    constGetSelectCountMarketCommentOnArticle, constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo, 
                    constGetSelectSpecificMarketDealedLogCheckedBySeller, constGetSelectSpecificMarketDealedLogCheckedByBuyer, constGetSelectSpecificMarketDealedLog ] = await Promise.all([
                    marketAPI.getSelectSpecificMarketArticleInfo(checkArticleId),
                    marketAPI.getSelectMarketUserInfo(checkUserStatus),
                    marketAPI.getSelectMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectCountMarketProductInterestedLogWhenArticleInfo(checkArticleId),
                    marketAPI.getSelectCountMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(checkUserStatus, checkArticleId),
                    marketAPI.getSelectSpecificMarketDealedLogCheckedBySeller(checkUserStatus, checkArticleId),
                    marketAPI.getSelectSpecificMarketDealedLogCheckedByBuyer(checkUserStatus, checkArticleId),
                    marketAPI.getSelectSpecificMarketDealedLog(checkArticleId) // 별도로 사이트에 기록하지는 않는 로드 데이터
                ]) 
                
                const constGetSelectSpecificMarketArticleInfoAndDistincted = {
                    article : constGetSelectSpecificMarketArticleInfo.marketArticleDto,
                    userInfo : constGetSelectSpecificMarketArticleInfo.marketUserInfoDto
                }
                console.log("constGetSelectSpecificMarketArticleInfoAndDistincted");
                console.log(constGetSelectSpecificMarketArticleInfoAndDistincted);
                // 여기서 조회수 바꾸고 update 로 변경 사항 넣기 (백엔드에서 조회수만 바꾸면 됨)
                setMergeMarketArticleInfo([constGetSelectSpecificMarketArticleInfoAndDistincted])
                setCheckArticleWriteUser(constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId);
                const constCommentOnArticleElementsFromAPI = constGetSelectMarketCommentOnArticle.map(APIElem1 => ({
                    comment : APIElem1.marketCommentOnArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                setMergeMarketCommentListOnArticle(constCommentOnArticleElementsFromAPI);
                setCountOfInterestedLogsOnArticle(constGetSelectCountMarketProductInterestedLogWhenArticleInfo);
                setCountOfCommentOnArticle(constGetSelectCountMarketCommentOnArticle);
                console.log("CommentTest");
                console.log(mergeMarketCommentListOnArticle);
                const constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted = {
                    article : constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.marketArticleDto,
                    userInfo : constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.marketUserInfoDto,
                    interestInfo : constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.marketProductInterestedLogDto
                }
                setMergeMarketProductInterestedLogOnArticle([constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted]);
                console.log("constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted");
                console.log(constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted);
                console.log("constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId");
                console.log(constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId);
                    
                console.log("constGetSelectSpecificMarketDealedLogCheckedBySeller");
                console.log(constGetSelectSpecificMarketDealedLogCheckedBySeller);
                console.log("constGetSelectSpecificMarketDealedLogCheckedByBuyer");
                console.log(constGetSelectSpecificMarketDealedLogCheckedByBuyer);
                console.log("constGetSelectSpecificMarketDealedLog");
                console.log(constGetSelectSpecificMarketDealedLog);
                console.log("checkUserStatus");
                console.log(checkUserStatus);
                
                if (Boolean(constGetSelectSpecificMarketDealedLogCheckedBySeller && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedBySeller).length > 0))) {
                    
                    console.log("marketProductDealedLogCheckedBySeller");
                    console.log(marketProductDealedLogCheckedBySeller);
                    console.log("constGetSelectSpecificMarketDealedLogCheckedBySeller");
                    console.log(constGetSelectSpecificMarketDealedLogCheckedBySeller);
                    setMarketProductDealedLogCheckedBySeller(constGetSelectSpecificMarketDealedLogCheckedBySeller);
                    
                }
                
                console.log(Boolean(constGetSelectSpecificMarketDealedLogCheckedBySeller && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedBySeller).length > 0)));
                console.log(Boolean(constGetSelectSpecificMarketDealedLogCheckedByBuyer && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedByBuyer).length > 0)));
                console.log(Boolean(constGetSelectSpecificMarketDealedLog && (Object.keys(constGetSelectSpecificMarketDealedLog).length > 0)));
                
                if (Boolean(constGetSelectSpecificMarketDealedLogCheckedByBuyer && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedByBuyer).length > 0))) {
                    
                    setMarketProductDealedLogCheckedByBuyer(constGetSelectSpecificMarketDealedLogCheckedByBuyer);
                    
                }
                
                if (Boolean(constGetSelectSpecificMarketDealedLog && (Object.keys(constGetSelectSpecificMarketDealedLog).length > 0))) {
                    
                    setMarketProductDealedLog(constGetSelectSpecificMarketDealedLog);
                    
                }
                
                if (checkUserStatus === constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId) {
                    
                    setCheckUserDealerStatus(1);
                    
                    if (constGetSelectSpecificMarketDealedLogCheckedBySeller) {
                        
                        setDealerCheckDivisionActivate(false);
                        
                    }
                    
                } else {
                    
                    setCheckUserDealerStatus(2);
                    
                    if (constGetSelectSpecificMarketDealedLogCheckedByBuyer) {
                        
                        setDealerCheckDivisionActivate(false);
                        
                    }
                    
                }
                
                if (constGetSelectSpecificMarketDealedLog) {
                    
                    setDealConfirmCompleted(true);
                    setDealerCheckDivisionActivate(false); // react 의 set 로드 문제 상 불가피한 절차 (원래는 dealconfirmcompleted 시 false 처리할 생각)
                    
                }
                    
                } catch (error) {
                    
                    console.error("로드 실패:", error);
                    
                } finally { // 여기는 reload 와 달라야 됨 (지금 잘못된 상태인데, 오류 발생 시에 고치기로....)
                    
                    setReloadingProductInterestedLogWhenUserAndArticleInfo(false);
                    setCommentOnArticleReloading(false);
                    setCommentOnArticleLoading(false);
                    setReloadingDealerCheckDivisionActivate(false);
                    console.log("Reloading Test End")
                    
                }
            
        }
        
        constUseEffect();
        
    }, []);
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (reloadingProductInterestedLogWhenUserAndArticleInfo) {
                
                try {
                    
                } catch (error) {
                    
                } finally {
                    
                    setReloadingProductInterestedLogWhenUserAndArticleInfo(false);
                    console.log("Interest Reloading Test End")
                    
                }
                
            }
            
        }
        
        constUseEffect();
        
    }, [reloadingProductInterestedLogWhenUserAndArticleInfo])
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (commentOnArticleReloading || reloadingProductInterestedLogWhenUserAndArticleInfo ||
                reloadingDealerCheckDivisionActivate
            ) {
            
                try {
                    
                console.log("Reloading Test Start") // Reload 안의 코드는 load 시의 코드와 같음
                
                const [ constGetSelectSpecificMarketArticleInfo, constGetSelectMarketUserInfo, constGetSelectMarketCommentOnArticle, constGetSelectCountMarketProductInterestedLogWhenArticleInfo, 
                    constGetSelectCountMarketCommentOnArticle, constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo, 
                    constGetSelectSpecificMarketDealedLogCheckedBySeller, constGetSelectSpecificMarketDealedLogCheckedByBuyer, constGetSelectSpecificMarketDealedLog ] = await Promise.all([
                    marketAPI.getSelectSpecificMarketArticleInfo(checkArticleId),
                    marketAPI.getSelectMarketUserInfo(checkUserStatus),
                    marketAPI.getSelectMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectCountMarketProductInterestedLogWhenArticleInfo(checkArticleId),
                    marketAPI.getSelectCountMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(checkUserStatus, checkArticleId),
                    marketAPI.getSelectSpecificMarketDealedLogCheckedBySeller(checkUserStatus, checkArticleId),
                    marketAPI.getSelectSpecificMarketDealedLogCheckedByBuyer(checkUserStatus, checkArticleId),
                    marketAPI.getSelectSpecificMarketDealedLog(checkArticleId) // 별도로 사이트에 기록하지는 않는 로드 데이터
                ]) 
                
                const constGetSelectSpecificMarketArticleInfoAndDistincted = {
                    article : constGetSelectSpecificMarketArticleInfo.marketArticleDto,
                    userInfo : constGetSelectSpecificMarketArticleInfo.marketUserInfoDto
                }
                console.log("constGetSelectSpecificMarketArticleInfoAndDistincted");
                console.log(constGetSelectSpecificMarketArticleInfoAndDistincted);
                // 여기서 조회수 바꾸고 update 로 변경 사항 넣기 (백엔드에서 조회수만 바꾸면 됨)
                setMergeMarketArticleInfo([constGetSelectSpecificMarketArticleInfoAndDistincted])
                setCheckArticleWriteUser(constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId);
                const constCommentOnArticleElementsFromAPI = constGetSelectMarketCommentOnArticle.map(APIElem1 => ({
                    comment : APIElem1.marketCommentOnArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                setMergeMarketCommentListOnArticle(constCommentOnArticleElementsFromAPI);
                setCountOfInterestedLogsOnArticle(constGetSelectCountMarketProductInterestedLogWhenArticleInfo);
                setCountOfCommentOnArticle(constGetSelectCountMarketCommentOnArticle);
                console.log("CommentTest");
                console.log(mergeMarketCommentListOnArticle);
                const constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted = {
                    article : constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.marketArticleDto,
                    userInfo : constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.marketUserInfoDto,
                    interestInfo : constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.marketProductInterestedLogDto
                }
                setMergeMarketProductInterestedLogOnArticle([constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted]);
                console.log("constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted");
                console.log(constGetSelectMarketProductInterestedLogWhenUserAndArticleInfoAndDistincted);
                console.log("constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId");
                console.log(constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId);
                    
                console.log("constGetSelectSpecificMarketDealedLogCheckedBySeller");
                console.log(constGetSelectSpecificMarketDealedLogCheckedBySeller);
                console.log("constGetSelectSpecificMarketDealedLogCheckedByBuyer");
                console.log(constGetSelectSpecificMarketDealedLogCheckedByBuyer);
                console.log("constGetSelectSpecificMarketDealedLog");
                console.log(constGetSelectSpecificMarketDealedLog);
                console.log("checkUserStatus");
                console.log(checkUserStatus);
                
                if (Boolean(constGetSelectSpecificMarketDealedLogCheckedBySeller && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedBySeller).length > 0))) {
                    
                    console.log("marketProductDealedLogCheckedBySeller");
                    console.log(marketProductDealedLogCheckedBySeller);
                    console.log("constGetSelectSpecificMarketDealedLogCheckedBySeller");
                    console.log(constGetSelectSpecificMarketDealedLogCheckedBySeller);
                    setMarketProductDealedLogCheckedBySeller(constGetSelectSpecificMarketDealedLogCheckedBySeller);
                    
                }
                
                console.log(Boolean(constGetSelectSpecificMarketDealedLogCheckedBySeller && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedBySeller).length > 0)));
                console.log(Boolean(constGetSelectSpecificMarketDealedLogCheckedByBuyer && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedByBuyer).length > 0)));
                console.log(Boolean(constGetSelectSpecificMarketDealedLog && (Object.keys(constGetSelectSpecificMarketDealedLog).length > 0)));
                
                if (Boolean(constGetSelectSpecificMarketDealedLogCheckedByBuyer && (Object.keys(constGetSelectSpecificMarketDealedLogCheckedByBuyer).length > 0))) {
                    
                    setMarketProductDealedLogCheckedByBuyer(constGetSelectSpecificMarketDealedLogCheckedByBuyer);
                    
                }
                
                if (Boolean(constGetSelectSpecificMarketDealedLog && (Object.keys(constGetSelectSpecificMarketDealedLog).length > 0))) {
                    
                    setMarketProductDealedLog(constGetSelectSpecificMarketDealedLog);
                    
                }
                
                if (checkUserStatus === constGetSelectSpecificMarketArticleInfoAndDistincted.article?.marketUserId) {
                    
                    setCheckUserDealerStatus(1);
                    
                    if (constGetSelectSpecificMarketDealedLogCheckedBySeller) {
                        
                        setDealerCheckDivisionActivate(false);
                        
                    }
                    
                } else {
                    
                    setCheckUserDealerStatus(2);
                    
                    if (constGetSelectSpecificMarketDealedLogCheckedByBuyer) {
                        
                        setDealerCheckDivisionActivate(false);
                        
                    }
                    
                }
                
                if (constGetSelectSpecificMarketDealedLog) {
                    
                    setDealConfirmCompleted(true);
                    setDealerCheckDivisionActivate(false); // react 의 set 로드 문제 상 불가피한 절차 (원래는 dealconfirmcompleted 시 false 처리할 생각)
                    
                }
                    
                } catch (error) {
                    
                    console.error("로드 실패:", error);
                    
                } finally {
                    
                    setReloadingProductInterestedLogWhenUserAndArticleInfo(false);
                    setCommentOnArticleReloading(false);
                    setCommentOnArticleLoading(false);
                    setReloadingDealerCheckDivisionActivate(false);
                    console.log("Reloading Test End")
                    
                }
                
            }
            
        }
        
        constUseEffect();
        
    }, [commentOnArticleReloading, reloadingProductInterestedLogWhenUserAndArticleInfo, reloadingDealerCheckDivisionActivate]);
    
    useEffect(() => {
            
        const constUseEffectWhenCommentOnArticleLoad = async () => {
            
            if (commentOnArticleLoading) {
                
            } else {
                
                
                const constmarketCommentElementListOnArticle = mergeMarketCommentListOnArticle
                .map(mergedElement => {
                    
                    return(
                    <MarketCommentElementOnArticle key = {mergedElement?.comment?.id} marketCommentElem1 = {mergedElement} onUpdateConfirm = {handleUpdateComment}/>
                    )});
                
            }
            
        }
        
        constUseEffectWhenCommentOnArticleLoad();
        
    }, [commentOnArticleLoading])
    
    //
    
    useEffect(() => {
        console.log("=== mergeMarketCommentEditElementListOnArticle 변경됨 ===");
        console.log(mergeMarketCommentEditElementListOnArticle);
    }, [mergeMarketCommentEditElementListOnArticle]);
    
    // ▲ Test Code For Comment Editing Process
    
    const constApplyTextContent = (element1) => {
        
        const { name, value } = element1.target;
        
        setInsertMarketCommentOnArticleElement(insertMarketCommentOnArticleElement => ({
            ...insertMarketCommentOnArticleElement,
            [name] : value
        }));
        
    }
    
    const constButtonToInsertMarketCommentOnArticle = async () => {
        
        const submitCommentOnArticleData = {
            ...insertMarketCommentOnArticleElement,
            content : contentRef.current.value
        };
        
        setInsertMarketCommentOnArticleElement(submitCommentOnArticleData);
        
        try {
            
            const constPostInsertMarketCommentOnArticle = await marketAPI.postInsertMarketCommentOnArticle(submitCommentOnArticleData);
            setInsertMarketCommentOnArticleElement(insertMarketCommentOnArticleElementDefaultValue);
            setCommentOnArticleReloading(true);
            setCommentOnArticleLoading(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constDivisionToDeleteMarketArticle = async ({articleId}) => {
        
        try {
            const constPostDeleteMarketArticle = await marketAPI.postDeleteMarketArticle(articleId);
            navigate(`/market`);
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constButtonToInsertMarketProductInterestedLog = async () => {
        
        try {
            
            const constInsertMarketProductInterestedLog = await marketAPI.postInsertMarketProductInterestedLog(insertMarketProductInterestedLog);
            setReloadingProductInterestedLogWhenUserAndArticleInfo(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constButtonToDeleteMarketProductInterestedLog = async () => {
        
        try {
            
            const constDeleteMarketProductInterestedLog = await marketAPI.postDeleteMarketProductInterestedLog(checkUserStatus, checkArticleId);
            setReloadingProductInterestedLogWhenUserAndArticleInfo(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constButtonToConfirmBuyerBySeller = async (marketCommentElem1) => {
            
        console.log("code executed");
        console.log("checkUserDealerStatus");
        console.log(checkUserDealerStatus);
        console.log("checkArticleId");
        console.log(checkArticleId);
        console.log("marketCommentElem1ConstButton");
        console.log(marketCommentElem1);
        
        if (checkUserDealerStatus === 1) {
        
            try {
                
                const { userInfo } = marketCommentElem1;
                
                const marketDealedLogCheckedBySellerDto = {
                    
                    sellerId : checkUserStatus,
                    buyerId : marketCommentElem1?.marketUserId,
                    specificArticleId : checkArticleId
                    
                } // 판매자가 구매자를 건드리는 경우 (댓글 작성자들이 구매자, 즉 판매자가 접속 상태인 것으로 가정)
                
                console.log("marketDealedLogCheckedBySellerDto");
                console.log(marketDealedLogCheckedBySellerDto);
                
                const constPostInsertMarketDealedLogCheckedBySeller = await marketAPI.postInsertMarketDealedLogCheckedBySeller(marketDealedLogCheckedBySellerDto);
                const constGetSelectSpecificMarketDealedLog = await marketAPI.getSelectSpecificMarketDealedLog(checkArticleId); // useEffect -> Reload 방식이 더 깔끔하기는 함 (이건 임시 조치용....)
                
                console.log("constGetSelectSpecificMarketDealedLog");
                console.log(constGetSelectSpecificMarketDealedLog);
                console.log(typeof constGetSelectSpecificMarketDealedLog);
                
                if (constGetSelectSpecificMarketDealedLog) {
                    
                    setMergeMarketArticleInfo(articleInfo => ([{
                        ...articleInfo[0],
                        article : {
                            ...articleInfo[0].article,
                            sellEnded : 1
                        }
                    }]));
                    
                }
                
            } catch (error) {
                console.error("로드 실패:", error);
            } finally {
                
                setReloadingDealerCheckDivisionActivate(true);
                
            }
            
        }
        
    }
    
    const handleBuyerConfirm = (marketCommentElement) => {
        
        console.log("marketCommentElement");
        console.log(marketCommentElement);
        constButtonToConfirmBuyerBySeller(marketCommentElement);
        
    }
    
    const constButtonToConfirmSellerByBuyer = async () => {
        
        if (checkUserDealerStatus === 2) {
            
            try {
                
                const { userInfo } = mergeMarketArticleInfo[0];
                
                const marketDealedLogCheckedByBuyerDto = {
                    
                    sellerId : userInfo?.id,
                    buyerId : checkUserStatus,
                    specificArticleId : checkArticleId
                    
                } // 판매자가 구매자를 건드리는 경우 (댓글 작성자들이 구매자, 즉 판매자가 접속 상태인 것으로 가정)
                
                const constPostInsertMarketDealedLogCheckedByBuyer = await marketAPI.postInsertMarketDealedLogCheckedByBuyer(marketDealedLogCheckedByBuyerDto);
                const constGetSelectSpecificMarketDealedLog = await marketAPI.getSelectSpecificMarketDealedLog(checkArticleId); // useEffect -> Reload 방식이 더 깔끔하기는 함 (이건 임시 조치용....)
                
                console.log("constGetSelectSpecificMarketDealedLog");
                console.log(constGetSelectSpecificMarketDealedLog);
                console.log(typeof constGetSelectSpecificMarketDealedLog);
                
                if (constGetSelectSpecificMarketDealedLog) {
                    
                    setMergeMarketArticleInfo(articleInfo => ([{
                        ...articleInfo[0],
                        article : {
                            ...articleInfo[0].article,
                            sellEnded : 1
                        }
                    }]));
                    
                }
                
            } catch (error) {
                console.error("로드 실패:", error);
            } finally {
                    
                setReloadingDealerCheckDivisionActivate(true);
                
            }
            
        }
        
    }
    
    const constDivisionToDeleteMarketCommentOnArticle = async ({commentId}) => {
        
        try {
            
            const constPostDeleteMarkeCommentOnArticle = await marketAPI.postDeleteMarketCommentOnArticle(commentId);
            setCommentOnArticleReloading(true);
            setCommentOnArticleLoading(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    function MarketArticleElement({marketArticleElem1}) {
        
        const { article = {} , userInfo = {} } = marketArticleElem1 ?? {};
        
        const formatDate = (dateString) => {
            
            const date = new Date(dateString);
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
        
            return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
        };
        
        const formatProductCost = (productCost) => {
            return productCost.toLocaleString('Ko-KR');
        };
        
        function funcSellEnded(sellEnded) {
            
            if (sellEnded == 1) {
                
                return (
                    <>
                        <span className = "badge badgeStyleAboutConfirmedDeal" style = {{fontSize : "0.75rem"}}>거래 완료</span>
                    </>
                );
                
            } else {
                
                return (
                    <>
                        <span className = "badge badgeStyleAboutUnconfirmedDeal" style = {{fontSize : "0.75rem"}}>거래 미완료</span>
                    </>
                );
                
            }
            
        }
        
        function funcFreeShare(productCost) {
            
            if (productCost == 0) {
                
                return (
                    <>
                        나눔 ( ￦ {productCost} ) 
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
        
        return(
            <>
            
                <div className = "row gx-0">
                        <div className = "col">
                            <div className = "row gx-0">
                                <div className = "col" style = {{marginLeft : "0.6125rem", marginRight : "0.6125rem", marginBottom : "0.6125rem"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{height : "15rem", overflow : "hidden", position : "relative", marginBottom : "0.8125rem"
                                        }}>
                                            {/* <div className = "row" style = {{height : "67%"}}>
                                                <div className = "col">
                                                    
                                                </div>
                                            </div> */}
                                            {imageLinkPath ?
                                            <>
                                                <div className = "row" style = {{height : "100%"}}>
                                                    <div className = "col" style = {{flexGrow : "2", background : "linear-gradient(to left, transparent, #6d6d6d80)"}}>
                                                        
                                                    </div>
                                                    <div className = "col" style = {{flexGrow : "7"}}>
                                                        
                                                    </div>
                                                    <div className = "col" style = {{flexGrow : "2", background : "linear-gradient(to right, transparent, #6d6d6d80)"}}>
                                                        
                                                    </div>
                                                </div>
                                                <MarketProductImageOnArticle imageLinkURL = {imageLinkURL}/>
                                            </>
                                            :
                                            <div className = "row" style = {{height : "100%"}}>
                                                <div className = "col" style = {{flexGrow : "2", background : "linear-gradient(to left, transparent, #6d6d6d80)"}}>
                                                    
                                                </div>
                                                <div className = "col" style = {{flexGrow : "7"}}>
                                                    
                                                </div>
                                                <div className = "col" style = {{flexGrow : "2", background : "linear-gradient(to right, transparent, #6d6d6d80)"}}>
                                                    
                                                </div>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{fontSize : "0.75rem", marginBottom : "0.25rem"}}>
                                            {funcSellEnded(article?.sellEnded)}
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{fontSize : "1.4375rem", marginBottom : "0.125rem"}}>
                                            {article?.title}
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "0.875rem"}}>
                                            <div className = "row h-100">
                                                <div className = "col-auto" style = {{fontSize : "1.125rem", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                    {funcFreeShare(article?.productCost)}
                                                </div>
                                                <div className = "col">
                                                    
                                                </div>
                                                <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                    <div className = "row">
                                                        <div className = "col-auto" style = {{fontSize : "0.75rem", display : "flex", alignItems : "center", color : "#6d6d6d"}}>
                                                            {formatDate(article?.createdAt)}
                                                            {/* {article.createdAt.toLocaleString()} */}
                                                        </div>
                                                        {/* 시간 여유 시 구현 목표로 하는 코드 및 시스템*/}
                                                        {/* <div className = "col-auto" style = {{fontSize : "1.5vh", display : "flex", alignItems : "center"}}>
                                                            조회수 {article.viewedCount}
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        bottom : "0", left : "0", width : "100%", height : "1px", backgroundColor : "#cccccc80", marginBottom : "0.125rem"
                                    }} />
                                    
                                    <div className = "row">
                                        <div className = "col">
                                            <div className = "row">
                                                <div className = "col" style = {{paddingLeft : "1.25rem", paddingRight : "1.25rem"}}>
                                                    
                                                    <div className = "row">
                                                        <div className = "col" style = {{height : "2.5rem", marginTop : "0.375rem", marginBottom : "0.375rem"}}>
                                                            
                                                            <Link className = "linkDefault" to = {`/market/user/${userInfo?.id}`} style = {{display : "inline-block"}}>
                                                            
                                                                <div className = "row">
                                                                    <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center", marginBottom : "0.5rem"}}>
                                                                        <div className = "row h-100">
                                                                            <div className = "col-auto" style = {{height : "2.3125rem", overflow : "hidden", position : "relative",
                                                                                paddingLeft : "0.125rem", paddingRight : "0.125rem"}}>
                                                                                <div className = "row h-100">
                                                                                    <div className = "col-auto" style = {{fontSize : "1.5rem", fontWeight : "bold", display : "flex", 
                                                                                    alignItems : "center", justifyContent : "center"}}>
                                                                                        <i className="bi bi-person-circle"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                                                <div className = "row h-100">
                                                                                    <div className = "col-auto" style = {{fontSize : "1.1875rem", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                                        {userInfo?.name}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            
                                                                {/* <div className = "row">
                                                                    <div className = "col-auto" style = {{fontSize : "0.9375rem", height : "2rem", overflow : "hidden", position : "relative", 
                                                                        paddingLeft : "0.25rem", paddingRight : "0.25rem"}}>
                                                                        <div className = "row h-100">
                                                                            <div className = "col-auto" style = {{fontSize : "1.5rem", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                                <i className="bi bi-person-circle"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                                        <div className = "row h-100">
                                                                            <div className = "col-auto" style = {{fontSize : "1.3125rem", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                                {userInfo.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div> */}
                                                                
                                                            </Link>
                                                            
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        bottom : "0", left : "0", width : "100%", height : "1px", backgroundColor : "#cccccc80", marginBottom : "0.125rem"
                                    }} />
                                    
                                    <div className = "row">
                                        <div className = "col">
                                            {/* 판매 상태 체크 */}
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{fontSize : "0.9375rem", minHeight : "6rem", marginTop : "0.875rem", marginBottom : "1rem", whiteSpace : "pre-wrap"}}>
                                            {article?.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            
            </>
        )
        
    }

    function MarketProductInterestedLogElementOnArticleWhenExists({marketArticleElem1}) {
        
        return(
            <>
            
                <button type="button" className="btn buttonWhenLikeDefault" onClick = {constButtonToDeleteMarketProductInterestedLog} 
                style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingLeft : "1.25rem", paddingRight : "1.25rem"}}>
                            
                        <i className="ri-heart-3-fill"></i> 탐냄 취소
                    
                </button>
            
            </>
        )
        
    }
    
    function MarketProductInterestedLogElementOnArticleWhenNotExists({marketArticleElem1}) {
        
        return(
            <>
            
                <button type="button" className="btn buttonWhenLikeDefault" onClick = {constButtonToInsertMarketProductInterestedLog} 
                style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingLeft : "1.25rem", paddingRight : "1.25rem"}}>
                    
                        <i className="ri-heart-3-line"></i> 탐나요!
                    
                </button>
            
            </>
        )
        
    }

    function MarketCommentElementOnArticle({marketCommentElem1, onUpdateConfirm}) {
        
        const { comment = {} , userInfo = {} } = marketCommentElem1 ?? {};
        
        console.log("{ comment = {} , userInfo = {} }");
        console.log(comment);
        console.log(userInfo);
        
        const formatDate = (dateString) => {
            
            const date = new Date(dateString);
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
        
            return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
        };
        
        const updateCommentRef = useRef(null); // ok
        
        const [ commentEditModeChecked, setCommentEditModeChecked ] = useState(false);
        
        const [ commentSellerCheckedByBuyer, setCommentSellerCheckedByBuyer ] = useState(false);
        const [ commentBuyerCheckedBySeller, setCommentBuyerCheckedBySeller ] = useState(false);
        
        const [ editingContent, setEditingContent ] = useState(comment?.content);
        
        console.log("editingContent");
        console.log(editingContent);
        console.log("comment?.id");
        console.log(comment?.id);
        
        const handleContentChange = (event) => {
            
            console.log("event.target.value");
            console.log(event.target.value);
            setEditingContent(event.target.value);
            
        }
        
        const handleSubmit = () => {
            
            console.log("handleSubmit");
            
            console.log("marketCommentElem1?.comment?.id, editingContent");
            console.log(marketCommentElem1?.comment?.id, editingContent);
            
            const updatedElement = {
                
                ...marketCommentElem1,
                comment : {
                    ...marketCommentElem1?.comment,
                    content : editingContent
                }
                
            };
            
            console.log("updatedElement");
            console.log(updatedElement);
            
            // console.log("mergeMarketCommentEditElementListOnArticle");
            // console.log(mergeMarketCommentEditElementListOnArticle);
            
            // setMergeMarketCommentEditElementListOnArticle(prevList => 
                
            //     prevList.map(element => {
                    
            //             console.log("element?.comment?.id")
            //             console.log(element?.comment?.id)
            //             console.log("marketCommentElem1?.comment?.id")
            //             console.log(marketCommentElem1?.comment?.id)
                    
            //             if (element?.comment?.id === marketCommentElem1?.comment?.id) {
            //                 console.log("map checking works")
            //                 return updatedElement;
            //             } else {
            //                 return element;
            //             }
                    
            //         }
            //         // element?.comment?.id === marketCommentElem1?.comment?.id
            //         // ?
            //         // updatedElement
            //         // :
            //         // element
                    
            //     )
                
            // )
            
            setMergeMarketCommentEditElementListOnArticle(updatedElement)
            
            onUpdateConfirm(updatedElement, marketCommentElem1?.comment?.id, editingContent);
            
            setCommentEditModeChecked(false);
            
        }
        
        const constButtonToConfirmBuyerBySeller = async () => {
                
            console.log("code executed");
            console.log("checkUserDealerStatus");
            console.log(checkUserDealerStatus);
            console.log("checkArticleId");
            console.log(checkArticleId);
            
            if (checkUserDealerStatus === 1) {
            
                try {
                    
                    const { userInfo } = marketCommentElem1;
                    
                    const marketDealedLogCheckedBySellerDto = {
                        
                        sellerId : checkUserStatus,
                        buyerId : userInfo?.id,
                        specificArticleId : checkArticleId
                        
                    } // 판매자가 구매자를 건드리는 경우 (댓글 작성자들이 구매자, 즉 판매자가 접속 상태인 것으로 가정)
                    
                    console.log("marketDealedLogCheckedBySellerDto");
                    console.log(marketDealedLogCheckedBySellerDto);
                    
                    const constPostInsertMarketDealedLogCheckedBySeller = await marketAPI.postInsertMarketDealedLogCheckedBySeller(marketDealedLogCheckedBySellerDto);
                    const constGetSelectSpecificMarketDealedLog = await marketAPI.getSelectSpecificMarketDealedLog(checkArticleId); // useEffect -> Reload 방식이 더 깔끔하기는 함 (이건 임시 조치용....)
                    
                    console.log("constGetSelectSpecificMarketDealedLog");
                    console.log(constGetSelectSpecificMarketDealedLog);
                    console.log(typeof constGetSelectSpecificMarketDealedLog);
                    
                    if (constGetSelectSpecificMarketDealedLog) {
                        
                        setMergeMarketArticleInfo(articleInfo => ([{
                            ...articleInfo[0],
                            article : {
                                ...articleInfo[0].article,
                                sellEnded : 1
                            }
                        }]));
                        
                    }
                    
                } catch (error) {
                    console.error("로드 실패:", error);
                } finally {
                    
                    setReloadingDealerCheckDivisionActivate(true);
                    
                }
                
            }
            
        }
        
        const constButtonToConfirmSellerByBuyer = async () => {
                
            console.log("code executed");
            console.log("checkUserDealerStatus");
            console.log(checkUserDealerStatus);
            
            if (checkUserDealerStatus === 2) {
            
                try {
                    
                    const { userInfo } = marketCommentElem1;
                    
                    const marketDealedLogCheckedByBuyerDto = {
                        
                        sellerId : userInfo?.id,
                        buyerId : checkUserStatus,
                        specificArticleId : checkArticleId
                        
                    } // 판매자가 구매자를 건드리는 경우 (댓글 작성자들이 구매자, 즉 판매자가 접속 상태인 것으로 가정)
                    
                    console.log("marketDealedLogCheckedByBuyerDto");
                    console.log(marketDealedLogCheckedByBuyerDto);
                    
                    const constPostInsertMarketDealedLogCheckedByBuyer = await marketAPI.postInsertMarketDealedLogCheckedByBuyer(marketDealedLogCheckedByBuyerDto);
                    const constGetSelectSpecificMarketDealedLog = await marketAPI.getSelectSpecificMarketDealedLog(checkArticleId); // useEffect -> Reload 방식이 더 깔끔하기는 함 (이건 임시 조치용....)
                    
                    console.log("constGetSelectSpecificMarketDealedLog");
                    console.log(constGetSelectSpecificMarketDealedLog);
                    console.log(typeof constGetSelectSpecificMarketDealedLog);
                    
                    if (constGetSelectSpecificMarketDealedLog) {
                        
                        setMergeMarketArticleInfo(articleInfo => ([{
                            ...articleInfo[0],
                            article : {
                                ...articleInfo[0].article,
                                sellEnded : 1
                            }
                        }]));
                        
                    }
                    
                } catch (error) {
                    console.error("로드 실패:", error);
                } finally {
                    
                    setReloadingDealerCheckDivisionActivate(true);
                    
                }
                
            }
            
        }
            
        function clickPossibleWhenCommentEditModeChecked() {
            
            setCommentEditModeChecked(false);
            
        }
        
        function clickPossibleWhenCommentEditModeUnchecked() {
            
            setCommentEditModeChecked(true);
            
        }
        
        function MarketCommentUpdateOrDeleteDivisionOnArticlePageLayout() {
            
            let letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout;
            
            if (checkUserStatus == comment?.marketUserId) {
                
                if (checkUserStatus === checkArticleWriteUser) {
                
                    letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                    
                    (
                        <>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "0.8125rem"}}>
                                    <div className = "row">
                                        
                                        {
                                            commentEditModeChecked ?
                                            (
                                                <>
                                                
                                                    <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => clickPossibleWhenCommentEditModeChecked()} 
                                                    style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                                        취소
                                                    </div>
                                                    
                                                </>
                                            ) :
                                            (
                                                <>
                                                
                                                    <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => clickPossibleWhenCommentEditModeUnchecked()} 
                                                    style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                                        수정
                                                    </div>
                                                
                                                </>
                                            )
                                        }
                                        
                                        <div className = "col-auto px-0" style = {{color : "#6d6d6d"}}>
                                            ｜
                                        </div>
                                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => constDivisionToDeleteMarketCommentOnArticle({commentId : comment?.id})}
                                        style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </>
                    );
                    
                } else {
                    
                    letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                    
                    (
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "0.8125rem"}}>
                                    <div className = "row">
                                        
                                        {
                                            commentEditModeChecked ?
                                            (
                                                <>
                                                
                                                    <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => clickPossibleWhenCommentEditModeChecked()} 
                                                    style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem"}}>
                                                        취소
                                                    </div>
                                                    
                                                </>
                                            ) :
                                            (
                                                <>
                                                
                                                    <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => clickPossibleWhenCommentEditModeUnchecked()} 
                                                    style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                                        수정
                                                    </div>
                                                
                                                </>
                                            )
                                        }
                                        
                                        <div className = "col-auto px-0">
                                            ｜
                                        </div>
                                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => constDivisionToDeleteMarketCommentOnArticle({commentId : comment?.id})}
                                        style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </>
                    );
                    
                }
                
            } else {
                
                if (checkUserStatus === checkArticleWriteUser) {
                
                    // letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                    
                    return (
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "0.875rem"}}>
                                    {/* <div className = "row">
                                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmBuyerBySeller}
                                        style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            구매인으로 선택
                                        </div>
                                    </div> */}
                                    <MarketDealerCheckDivisionActivateOnCommentOnArticleLayout 
                                    marketCommentElem1 = {comment}
                                    constButtonToConfirmBuyerBySeller1 = {constButtonToConfirmBuyerBySeller}
                                    constButtonToConfirmSellerByBuyer1 = {constButtonToConfirmSellerByBuyer}
                                    />
                                </div>
                            </div>
                        
                        </>
                    );
                    
                } else {
                    
                    if (comment?.marketUserId == checkArticleWriteUser) {
                        
                        // letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                        
                        return (
                            <>
                            
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "0.875rem"}}>
                                        {/* <div className = "row">
                                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmSellerByBuyer}
                                            style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                                판매인으로 선택
                                            </div>
                                        </div> */}
                                        <MarketDealerCheckDivisionActivateOnCommentOnArticleLayout 
                                        constButtonToConfirmBuyerBySeller1 = {constButtonToConfirmBuyerBySeller}
                                        constButtonToConfirmSellerByBuyer1 = {constButtonToConfirmSellerByBuyer}/>
                                    </div>
                                </div>
                            
                            </>
                        );
                        
                    } else {
                        
                        // letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                        
                        (
                            <>
                            
                            
                            
                            </>
                        );
                        
                    }
                    
                }
                
            }
            
            return(letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout);
            
        }
        
        let letFuncMarketCommentElementOnArticle; // final return
        
        letFuncMarketCommentElementOnArticle =
        
        (
            <>
            
                <div className = "row">
                        <div className = "col">
                            {/*  날짜 값이 null 인 경우와 null 이 아닌 경우를 철저히 체크할 것 (toLocaleString 시 오류 방지) */}
                            <div className = "row" style = {{marginBottom : "0.8125rem"}}>
                                <div className = "col" style = {{paddingLeft : "0.8125rem", paddingRight : "0.8125rem"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{marginLeft : "0.8125rem", marginRight : "0.8125rem", marginBottom : "0.1875rem"}}>
                                            
                                            {/* <div style={{
                                                bottom : "0", left : "0", width : "100%", height : "1px", backgroundColor : "#cccccc80"
                                            }} /> */}
                                            
                                            <div className = "row">
                                                <div className = "col" style = {{height : "2rem", marginTop : "0.375rem", marginBottom : "0.375rem"}}>

                                                <Link className = "linkDefault" to = {`/market/user/${userInfo?.id}`} style = {{display : "inline-block"}}>
                                                
                                                    <div className = "row">
                                                        <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center", marginBottom : "0.5rem"}}>
                                                            <div className = "row h-100">
                                                                <div className = "col-auto" style = {{height : "1.8125rem", overflow : "hidden", position : "relative",
                                                                    paddingLeft : "0.125rem", paddingRight : "0.125rem"}}>
                                                                    <div className = "row h-100">
                                                                        <div className = "col-auto" style = {{fontSize : "1.1875rem", fontWeight : "bold", display : "flex", 
                                                                        alignItems : "center", justifyContent : "center"}}>
                                                                            <i className="bi bi-person-circle"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                                    <div className = "row h-100">
                                                                        <div className = "col-auto" style = {{fontSize : "1.0625rem", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                            {userInfo?.name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                </Link>

                                                </div>
                                            </div>
                                            

                                            
                                            {/* <div style={{
                                                bottom : "0", left : "0", width : "100%", height : "1px", backgroundColor : "#cccccc80"
                                            }} /> */}
                                            
                                            {commentEditModeChecked ? 
                                            (
                                                <>
                                                
                                                    <div className = "row">
                                                        <div className = "col" style = {{marginBottom : "0.4375rem"}}>
                                                            <div className = "row h-100">
                                                                <div className = "col" style = {{display : "flex", alignItems : "center", verticalAlign : "middle",
                                                                    paddingLeft : "0.25rem", paddingRight : "0.25rem", fontSize : "0.8125rem"}}>
                                                                    <textarea rows = "3" className = "form-control writeArticleTextDivisionDefault" 
                                                                    id = "content" name = "content" 
                                                                    value = {editingContent} onChange = {handleContentChange} ref = {updateCommentRef}
                                                                    placeholder = "수정할 댓글을 입력해 주시오."
                                                                    style = {{resize : "none", fontSize : "0.875rem"}}/>
                                                                </div>
                                                                <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center", paddingLeft : "0rem", paddingRight : "0rem", marginLeft : "0.4375rem"}}>
                                                                    <div className = "row h-100 gx-0">
                                                                        <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                                            <button className = "btn buttonDefault" 
                                                                            onClick = {handleSubmit} 
                                                                            style = {{fontSize : "0.9375rem", fontWeight : "bold"}}>쓰기</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                
                                                </>
                                            ) :
                                            (
                                                <>
                                                
                                                    <div className = "row">
                                                        <div className = "col" style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", fontSize : "0.875rem", marginBottom : "0.4375rem", whiteSpace : "pre-wrap"}}>
                                                            {comment?.content}
                                                        </div>
                                                    </div>
                                                
                                                </>
                                            )
                                            }
                                            
                                            <div className = "row">
                                                <div className = "col" style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", fontSize : "0.6875rem", marginBottom : "0.125rem", color : "#6d6d6d"}}>
                                                    {formatDate(comment?.createdAt)}
                                                </div>
                                            </div>
                                            
                                            <MarketCommentUpdateOrDeleteDivisionOnArticlePageLayout />
                                            
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                </div>
            
            </>
        )
        
        return(letFuncMarketCommentElementOnArticle);
        
    }
    
    function MarketDealerCheckDivisionActivateOnArticleLayout() {
        
        let letMarketDealerCheckDivisionActivateOnArticleLayout;
        
        if (dealerCheckDivisionActivate) {
            
            letMarketDealerCheckDivisionActivateOnArticleLayout = 
            
            (
                <>
                
                    {/* <div className = "row">
                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmSellerByBuyer}
                        style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                            판매인으로 선택
                        </div>
                    </div> */}
        
                    {isSellerWarningModalOpened && ((
                        <SelectSellerWarningModal open = {isSellerWarningModalOpened}
                        onClose = {() => setIsSellerWarningModalOpened(false)}
                        onConfirm = {constButtonToConfirmSellerByBuyer} />
                    ))}
                    
                    <div className = "row">
                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => setIsSellerWarningModalOpened(true)}
                        style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                            판매인으로 선택
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            letMarketDealerCheckDivisionActivateOnArticleLayout =
            
            (
                <>
                


                
                </>
            )
            
        }
        
        return (letMarketDealerCheckDivisionActivateOnArticleLayout)
        
    }
    
    function MarketDealerCheckDivisionActivateOnCommentOnArticleLayout({marketCommentElem1, constButtonToConfirmBuyerBySeller1, constButtonToConfirmSellerByBuyer1}) {
        
        console.log("marketCommentElem1Activate")
        console.log(marketCommentElem1)
        
        // let letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout;
        
        if (checkUserDealerStatus === 1) {
            
            if (dealerCheckDivisionActivate) {
                
                // letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout = 
                
                return (
                    <>

                        {/* <div className = "row">
                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmBuyerBySeller1}
                            style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                구매인으로 선택
                            </div>
                        </div> */}
                        
                        {isBuyerWarningModalOpened && ((
                            <SelectBuyerWarningModal open = {isBuyerWarningModalOpened}
                            onClose = {() => setIsBuyerWarningModalOpened(false)}
                            onConfirm = {() => handleBuyerConfirm(marketCommentElem1)} />
                        ))}
                        
                        <div className = "row">
                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => setIsBuyerWarningModalOpened(true)}
                            style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                구매인으로 선택
                            </div>
                        </div>
                    
                    </>
                )
                
            } else {
                
                // letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout =
                
                return (
                    <>
                    
                    
                    
                    </>
                )
                
            }
            
        } else
            // checkUserDealerStatus 가 2인 경우도 포함
        {
            
            if (dealerCheckDivisionActivate) {
                
                // letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout = 
                
                return (
                    <>

                        {/* <div className = "row">
                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmSellerByBuyer1}
                            style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                판매인으로 선택
                            </div>
                        </div> */}
                        
                        {/* <SelectSellerWarningModal open = {isSellerWarningModalOpened}
                        onClose = {() => setIsSellerWarningModalOpened(false)}
                        onConfirm = {constButtonToConfirmSellerByBuyer1} /> */}
                        
                        {/* 되나??? */}
                        
                        <div className = "row">
                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => setIsSellerWarningModalOpened(true)}
                            style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}}>
                                판매인으로 선택
                            </div>
                        </div>
                    
                    </>
                )
                
            } else {
                
                // letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout =
                
                return (
                    <>
                    
                    
                    
                    </>
                )
                
            }
            
        }
        
        //
        
        // if (dealerCheckDivisionActivate) {
            
        //     letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout = 
            
        //     (
        //         <>

        //             <div className = "row">
        //                 <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmSellerByBuyer}
        //                 style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
        //                     판매인으로 선택
        //                 </div>
        //             </div>
                
        //         </>
        //     )
            
        // } else {
            
        //     letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout =
            
        //     (
        //         <>
                
                
                
        //         </>
        //     )
            
        // }
        
        // ▲ 중복 코드
        
        // return (letMarketDealerCheckDivisionActivateOnCommentOnArticleLayout)
        
    }
    
    function MarketArticleUpdateOrDeleteDivisionPageLayout({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
        
        let letMarketArticleUpdateOrDeleteDivisionPageLayout;
        
        if (checkUserStatus == article?.marketUserId) {
            
            letMarketArticleUpdateOrDeleteDivisionPageLayout =
            
            (
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{marginLeft : "0.6125rem", marginRight : "0.6125rem", fontSize : "1rem"}}>
                            <div className = "row">
                                <div className = "col-auto" style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem"}}>
                                    <Link className = "linkDefault divisionOnclickStyleDefault" to = {`/market/updateArticle/${article?.id}`}
                                    style = {{color : "#6d6d6d"}}>
                                        수정
                                    </Link>
                                </div>
                                <div className = "col-auto px-0" style = {{color : "#6d6d6d"}}>
                                    ｜
                                </div>
                                <div className = "col-auto divisionOnclickStyleDefault" style = {{paddingLeft : "0.25rem", paddingRight : "0.25rem", color : "#6d6d6d"}} 
                                onClick = {() => constDivisionToDeleteMarketArticle({articleId : article?.id})}>
                                    삭제
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            letMarketArticleUpdateOrDeleteDivisionPageLayout =
            
            (
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{marginLeft : "0.6125rem", marginRight : "0.6125rem", fontSize : "1rem"}}>
                            {/* <div className = "row">
                                <div className = "col-auto divisionOnclickStyleDefault" onClick = {constButtonToConfirmSellerByBuyer}
                                style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                    판매인으로 선택
                                </div>
                            </div> */}
                            <MarketDealerCheckDivisionActivateOnArticleLayout />
                        </div>
                    </div>
                
                </>
            )
            
        }
        
        return(letMarketArticleUpdateOrDeleteDivisionPageLayout);
        
    }
    
    function MarketBuyerOrSellerCheckedInformationOnArticleDivisionPageLayout({marketArticleElem1}) {
        
        const { article = {} , userInfo = {} } = marketArticleElem1 ?? "";
        
        if (checkUserStatus == article?.marketUserId) {
            
            console.log("marketProductDealedLogCheckedBySeller Checking");
            console.log(marketProductDealedLogCheckedBySeller);
            
            if (Boolean(marketProductDealedLog && (Object.keys(marketProductDealedLog).length > 0))) {
        
                return (
                    <>
                    
                        <div className = "row">
                            <div className = "col buyerOrSellerCheckedInformationOnArticleDivisionPageLayoutDefalut" style = {{
                            marginLeft : "0.25rem", marginRight : "0.25rem", display : "flex", justifyContent : "center", alignitems : "center",
                            fontSize : "1rem", fontWeight : "bold", color : "#001439"}}>
                                구매인과 거래를 완료하였소.
                            </div>
                        </div>
                        
                    </>
                );
                
            } else {
                
                if (Boolean(marketProductDealedLogCheckedBySeller && (Object.keys(marketProductDealedLogCheckedBySeller).length > 0))) {
            
                    return (
                        <>
                        
                            <div className = "row">
                                <div className = "col buyerOrSellerCheckedInformationOnArticleDivisionPageLayoutDefalut" style = {{
                                marginLeft : "0.25rem", marginRight : "0.25rem", display : "flex", justifyContent : "center", alignitems : "center",
                                fontSize : "1rem", fontWeight : "bold", color : "#001439"}}>
                                    구매인 선택을 완료하였소.
                                </div>
                            </div>
                            
                        </>
                    );
                    
                } else {
                    
                    return (<></>);
                    
                }
                
            }
            
        } else {
            
            if (Boolean(marketProductDealedLog && (Object.keys(marketProductDealedLog).length > 0))) {
        
                return (
                    <>
                    
                        <div className = "row">
                            <div className = "col buyerOrSellerCheckedInformationOnArticleDivisionPageLayoutDefalut" style = {{
                            marginLeft : "0.25rem", marginRight : "0.25rem", display : "flex", justifyContent : "center", alignitems : "center",
                            fontSize : "1rem", fontWeight : "bold", color : "#001439"}}>
                                판매인과 거래를 완료하였소.
                            </div>
                        </div>
                            
                    </>
                );
                
            } else {
                
                if (Boolean(marketProductDealedLogCheckedByBuyer && (Object.keys(marketProductDealedLogCheckedByBuyer).length > 0))) {
            
                    return (
                        <>
                        
                            <div className = "row">
                                <div className = "col buyerOrSellerCheckedInformationOnArticleDivisionPageLayoutDefalut" style = {{
                                marginLeft : "0.25rem", marginRight : "0.25rem", display : "flex", justifyContent : "center", alignitems : "center",
                                fontSize : "1rem", fontWeight : "bold", color : "#001439"}}>
                                    판매인 선택을 완료하였소.
                                </div>
                            </div>
                        
                        </>
                    );
                    
                } else {
                    
                    return (<></>);
                    
                }
                
            }
            
            
        }
        
    }
    
    function MarketArticleLikeButtonPageLayout({marketArticleElem1}) {
        
        const { article = {} , userInfo = {} } = marketArticleElem1 ?? "";
                                
        if (constMarketProductInterestedLogElement.length > 0) {} else {}
        <></>
        
        if (checkUserStatus == article?.marketUserId) {
            
            return(
                <>
                
                    <div className = "row gx-0" 
                    // style = {{marginTop : "0.3125rem", marginBottom : "1.4375rem"}}
                    >
                        <div className = "col-auto" style = {{fontSize : "0.8125rem"}}>
                            <button type="button" className="btn buttonWhenLikeDefault" disabled = {true}
                            style = {{fontSize : "0.9375rem", fontWeight : "bold", paddingLeft : "1.25rem", paddingRight : "1.25rem"}}>
                                
                                {
                                    <>
                                        <i className="ri-heart-3-line"></i> 탐나요!
                                    </>
                                }
                                
                            </button>
                            {/* 본인의 게시글은 탐냄을 할 수 없소. */}
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            return(
                <>
                
                    <div className = "row gx-0">
                        <div className = "col-auto">
                            
                            {
                                constMarketProductInterestedLogElement.length > 0 ? 
                                constMarketProductInterestedLogElement
                                : 
                                <>
                                    <MarketProductInterestedLogElementOnArticleWhenNotExists />
                                </>
                                
                            }
                            
                        </div>
                    </div>
                
                </>
            )
            
        }
        
    }
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row" style = {{height : "100vh"}}>
                    {/* <div className = "widthDefault"> */}
                    <div className = "col h-100" style = {{position : "relative"}}>
                        <div className = "primaryDivisionSizeDefault">
                            <div className = "row" style = {{height : "100%"}}>
                                <div className = "col primaryDivisionDefault h-100"
                                style = {{position : "relative", paddingLeft : "0.8125rem", paddingRight : "0.8125rem", overflowX : "hidden", overflowY : "auto"}}>
                                    <div className = "row">
                                        <div className = "col gx-0" style = {{marginLeft : "0.6125rem", marginRight : "0.6125rem", marginBottom : "0.6125rem"}}>
                                            
                                            {
                                                constMarketArticleElement.length > 0 ? 
                                                constMarketArticleElement : 
                                                <></>
                                            }
                                            
                                        </div>
                                    </div>
                                    <div style={{
                                        bottom : "0", left : "0", width : "100%", height : "1px", backgroundColor : "#cccccc", marginBottom : "0.125rem"
                                    }} />
                                    <div style={{
                                        // bottom: 0, left: 0, width: "100%", height: "0.5vh", background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1875), transparent)",
                                        // pointerEvents: "none", marginBottom : "1.25vh"
                                        bottom : "0", left : "0", width : "100%", height : "1px", backgroundColor : "#cccccc", marginBottom : "0.5rem"
                                    }} />
                                    
                                    {
                                        constMarketArticleUpdateOrDeleteDivisionPageLayout.length > 0 ? 
                                        constMarketArticleUpdateOrDeleteDivisionPageLayout : 
                                        <></>
                                    }
                                    
                                    <div className = "row">
                                        <div className = "col" style = {{height : "0.0625rem", marginBottom : "1.625rem"}}>
                                        </div>
                                    </div>

                                    {
                                        constMarketBuyerOrSellerCheckedInformationOnArticleDivisionPageLayout.length > 0 ? 
                                        constMarketBuyerOrSellerCheckedInformationOnArticleDivisionPageLayout : 
                                        <></>
                                    }

                                    <div className = "row">
                                        <div className = "col" style = {{height : "0.0625rem", marginBottom : "1.625rem"}}>
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "1.25rem", paddingLeft : "1.25rem", paddingRight : "1.25rem"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "1.25rem", fontWeight : "bold", marginBottom : "0.4375rem"}}>
                                                    탐냄 {countOfInterestedLogsOnArticle}개
                                                </div>
                                            </div>
                                            
                                            {
                                                constMarketArticleLikeButtonPageLayout.length > 0 ? 
                                                constMarketArticleLikeButtonPageLayout : 
                                                <></>
                                            }

                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "1.25rem", paddingRight : "1.25rem", marginBottom : "0.6125rem"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "1.25rem", fontWeight : "bold", marginBottom : "0.4375rem"}}>
                                                    댓글 {countOfCommentOnArticle}개
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.25rem", paddingTop : "0.8125rem", paddingBottom : "0.25rem", 
                                                paddingLeft : "0.8125rem", paddingRight : "0.8125rem"}}>

                                                    <div className = "row">
                                                        <div className = "col" style = {{paddingLeft : "0.8125rem", paddingRight : "0.8125rem"}}>
                                                            {
                                                                constmarketCommentElementListOnArticle.length  > 0 ? 
                                                                constmarketCommentElementListOnArticle : 
                                                                <>
                                                                    
                                                                    <div className = "row">
                                                                        <div className = "col" style = {{fontSize : "0.9375rem", paddingLeft : "1.25rem", paddingRight : "1.25rem",
                                                                            marginTop : "0.625rem", marginBottom : "1rem"
                                                                        }}>
                                                                            게시글에 쓰인 댓글이 없소.
                                                                        </div>
                                                                    </div>
                                                                
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                    
                                                    <div className = "row">
                                                        <div className = "col">
                                                            <div className = "row h-100">
                                                                <div className = "col" style = {{marginTop : "0.6125rem", marginBottom : "1.5rem"}}>
                                                                    <div className = "row h-100">
                                                                        <div className = "col">
                                                                            <div className = "row h-100">
                                                                                <div className = "col" style = {{display : "flex", alignItems : "center", verticalAlign : "middle"}}>
                                                                                    <textarea rows = "3" className = "form-control writeArticleTextDivisionDefault" 
                                                                                    id = "content" name = "content" value = {insertMarketCommentOnArticleElement.content} 
                                                                                    onChange = {constApplyTextContent} ref = {contentRef}
                                                                                    placeholder = "댓글을 작성해 보겠소?"
                                                                                    style = {{resize : "none", fontSize : "0.875rem", overflow : "hidden", alignSelf : "center"}}/>
                                                                                </div>
                                                                                <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center", paddingLeft : "0rem"}}>
                                                                                    <div className = "row h-100 gx-0">
                                                                                        <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                                                            <button className = "btn buttonDefault" onClick = {constButtonToInsertMarketCommentOnArticle} style = {{fontSize : "0.9375rem", fontWeight : "bold"}}>쓰기</button>
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
                                            <div className = "row">
                                                <div className = "col" style = {{marginTop : "0.8125rem"}}>
                                                    <div className = "row">
                                                        <div className = "col">
                                                            
                                                        </div>
                                                        <div className = "col d-flex justify-content-end">
                                                            <div className = "row">
                                                                <div className = "col-auto">
                                                                    {/* <button className = "btn buttonCancellationDefault" onClick = {() => navigate(-1)}
                                                                    style = {{fontSize : "0.75rem", fontWeight : "bold"}}>이전으로</button> */}
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
                    {/* </div> */}
                </div>
                
            </div>
        
        </>
        
    )
    
}