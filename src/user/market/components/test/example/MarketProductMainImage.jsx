export default function MarketProductMainImage({imageLinkURL}) {
    
    return ( 
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col" style = {{width : "12.5vh", height : "12.5vh", position : "relative", overflow : "hidden", 
                        border : "1px solid #cccccc", borderRadius : "1.25vh", display: "flex", justifyContent: "center", padding : "0vh", alignItems: "center",}}>
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