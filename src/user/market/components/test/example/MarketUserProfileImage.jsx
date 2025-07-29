export default function MarketUserProfileImage() {
    
    return ( 
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col">
                        <img src = "/src/assets/img/market/test/example/ca_2nd_project_user_profile_division.png" 
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