export default function MarketProductMainImage({imageLinkURL}) {
    
    return ( 
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col" style = {{width : "5rem", height : "5rem", position : "relative", overflow : "hidden", 
                        border : "1px solid #cccccc", borderRadius : "0.5rem", display: "flex", justifyContent: "center", padding : "0rem", alignItems: "center",}}>
                        <img src = {imageLinkURL}
                        style = {{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            height: "100%",
                            objectFit: "cover",
                            zIndex : "2"
                        }}/>
                    </div>
                </div>
                
            </div>
        
        </>
        
    )
    
}