export default function MarketProductImageOnArticle() {
    
    return ( 
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col">
                        <img src = "/sources/images/ca_2nd_project_product_example.png" 
                        style = {{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            height: "100%",
                            objectFit: "cover"
                        }}/>
                    </div>
                </div>
                
            </div>
        
        </>
        
    )
    
}