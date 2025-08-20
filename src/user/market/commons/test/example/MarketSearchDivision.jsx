import '../../../styles/MarketCommonStyles.css';

export default function MarketSearchDivision({ inputSearchWord, constApplySearchWord, constButtonToSendSearchWordParam, searchWordRef }) {
    
    return(
        <>
        
            <div className = "row" style = {{height : "5.5vh", marginTop : "1vh", marginBottom : "4vh"}}>
                <div className = "widthDefault">
                    <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center"}}>
                        <div className = "row h-100">
                            <div className = "col" style = {{ display : "flex", paddingLeft: "2vh", paddingRight: "1vh", alignItems : "center"}}>
                                <input className = "form-control searchBarDefault" 
                                id = "searchWord" name = "searchWord" value = {inputSearchWord} onChange = {constApplySearchWord} ref = {searchWordRef}
                                style = {{fontSize : "2.25vh", height : "7vh"}} placeholder = "검색어로 게시글을 찾을 수 있소."></input>
                            </div>
                            <div className = "col-auto" style = {{ paddingRight: "2vh"}}>
                                <button type="button" className="btn btn-light buttonDefault" onClick = {constButtonToSendSearchWordParam} 
                                style = {{fontSize : "2.5vh", height : "7vh", display : "flex", alignItems : "center", justifyContent : "center"}}>검색</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
    
}