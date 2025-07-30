import MarketFetchMyPhotoOnWriteArticle from "../components/MarketFecthMyPhotoOnWriteArticle";

export default function MarketWriteArticlePage() {
    
    return(
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col primaryDivisionDefault" style = {{ height : "80vh", overflowX : "hidden"}}>
                        
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
                                        <input className = "form-control writeArticleTextDivisionDefault" style = {{fontSize : "1.75vh"}}/>
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
                                        <input className = "form-control writeArticleTextDivisionDefault" style = {{fontSize : "1.75vh"}}/>
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
                                        <textarea className = "form-control writeArticleTextDivisionDefault" style = {{fontSize : "1.75vh"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className = "row">
                            <div className = "col">
                                등록 버튼, 취소 버튼
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        
        </>
    )
    
}