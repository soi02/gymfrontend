import default_profile_img from '../../../../../assets/img/default_profile_img.svg';

export default function MarketUserProfileImage() {
    
    return ( 
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col">
                        <img src = {default_profile_img}
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