export default function MarketProductImageOnArticle({imageLinkURL}) {
    
    return ( 
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col">
                        <img src = {imageLinkURL}
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

// "/src/assets/img/market/test/example/ca_2nd_project_product_example.png" 

// ▲ 이미지 없을 시 사용하게 될 경로 참고용