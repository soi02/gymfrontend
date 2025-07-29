export default function MarketSearchDivision() {
    
    return(
        <>
        
            <div className = "row" style = {{height : "5.5vh", marginTop : "1vh", marginBottom : "3vh"}}>
                <div className = "widthDefault">
                    <div className = "col">
                        <div className = "row h-100">
                            <div className = "col" style = {{ paddingLeft: "2vh", paddingRight: "1vh"}}>
                                <input type = "text" className = "form-control searchBarDefault" style = {{fontSize : "2.5vh"}}
                                placeholder = "검색어를 입력해 주세요."></input>
                            </div>
                            <div className = "col-auto" style = {{ paddingRight: "2vh"}}>
                                <button type="button" className="btn btn-light buttonDefault" style = {{fontSize : "2.5vh"}}>검색</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
    
}