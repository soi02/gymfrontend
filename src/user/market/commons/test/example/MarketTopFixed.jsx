import '../../../styles/MarketCommonStyles.css';

export default function MarketTopFixed() {
    
    return (
        
        <>
        
            <div className = "row" style = {{height : "10vh"}}>
                <div className = "widthDefault">
                    <div className = "col marketTopFixed" style = {{paddingLeft : "0rem", paddingRight : "0rem"}}>
                        <div className = "row h-100">
                            <div className = "col" style = {{flexGrow : "1", fontSize : "4vh",
                            display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center"
                            }}>
                                <i className="bi bi-chevron-left"></i>
                            </div>
                            <div className = "col" style = {{flexGrow : "4", fontSize : "3.25vh",
                            display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center"}}>
                                마켓공간
                            </div>
                            <div className = "col" style = {{flexGrow : "1", fontSize : "4vh",
                            display : "flex", alignItems : "center", justifyContent : "center", textAlign : "center"}}>
                                <i className="bi bi-bell"></i> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
        
    )
    
}