import ca_2nd_project_user_profile_division from '../../../../../assets/img/market/test/example/ca_2nd_project_user_profile_division.png'
import default_profile_img from '../../../../../assets/img/default_profile_img.svg';

export default function MarketAnonymousUserMiniProfileImage() {
    
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