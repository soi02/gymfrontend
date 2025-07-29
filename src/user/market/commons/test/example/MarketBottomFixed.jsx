import { Link } from "react-router-dom";
import '../../../styles/MarketCommonStyles.css';

export default function MarketBottomFixed() {
    
    return (
        
        <>
            
            <div className = "row fixed-bottom" style = {{height : "10vh", paddingLeft : "0.75rem", paddingRight : "0.75rem"}}>
                <div className = "widthDefault">
                    <div className = "col marketBottomFixed" style = {{paddingLeft : "0.75rem", paddingRight : "0.75rem"}}>
                        <div className = "row h-100">
                            <div className = "col" style = {{flexGrow : "1"}}>
                                <Link className = "linkDefault" to = "/projectSite/market/board">
                                    <div className = "row h-100">
                                        <div className = "col w-100" style = {{flexGrow : "1", fontSize : "1.5vh", padding : "1vh",
                                        display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center", flexDirection : "column"}}>
                                            <span style = {{fontSize : "3vh"}}><i className="bi bi-house"></i></span>
                                            홈
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className = "col" style = {{flexGrow : "1"}}>
                                <Link className = "linkDefault" to = "/projectSite/market/writeArticle">
                                    <div className = "row h-100">
                                        <div className = "col w-100" style = {{flexGrow : "1", fontSize : "1.5vh", padding : "1vh",
                                        display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center", flexDirection : "column"}}>
                                            <span style = {{fontSize : "3vh"}}><i className="bi bi-pen"></i></span>
                                            글쓰기
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className = "col" style = {{flexGrow : "1"}}>
                                <Link className = "linkDefault" to = "/projectSite/market/myLikedProducts">
                                    <div className = "row h-100">
                                        <div className = "col w-100" style = {{flexGrow : "1", fontSize : "1.5vh", padding : "1vh",
                                        display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center", flexDirection : "column"}}>
                                            <span style = {{fontSize : "3vh"}}><i className="bi bi-heart"></i></span>
                                            내관심
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className = "col" style = {{flexGrow : "1"}}>
                                <Link className = "linkDefault" to = "/projectSite/market/user">
                                    <div className = "row h-100">
                                        <div className = "col w-100" style = {{flexGrow : "1", fontSize : "1.5vh", padding : "1vh",
                                        display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center", flexDirection : "column"}}>
                                            <span style = {{fontSize : "3vh"}}><i className="bi bi-person"></i></span>
                                            내마켓정보
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
        
    )
    
}