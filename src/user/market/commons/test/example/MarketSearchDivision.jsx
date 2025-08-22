import '../../../styles/MarketCommonStyles.css';

export default function MarketSearchDivision({ inputSearchWord, constApplySearchWord, constButtonToSendSearchWordParam, searchWordRef }) {
    
    return(
        <>
        
            <div className = "row" style = {{height : "2.25rem", marginTop : "0.4375rem", marginBottom : "1.625rem"}}>
                <div className = "widthDefault">
                    <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center"}}>
                        <div className = "row h-100">
                            <div className = "col" style = {{ display : "flex", paddingLeft: "0.8125rem", paddingRight: "0.4375rem", alignItems : "center"}}>
                                <input className = "form-control searchBarDefault" 
                                id = "searchWord" name = "searchWord" value = {inputSearchWord} onChange = {constApplySearchWord} ref = {searchWordRef}
                                style = {{fontSize : "0.9375rem", height : "3rem"}} placeholder = "검색어로 게시글을 찾을 수 있소."></input>
                            </div>
                            <div className = "col-auto" style = {{ paddingRight: "0.8125rem"}}>
                                <button type="button" className="btn btn-light buttonDefault" onClick = {constButtonToSendSearchWordParam} 
                                style = {{fontSize : "1rem", height : "3rem", display : "flex", alignItems : "center", justifyContent : "center"}}>검색</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
    
}