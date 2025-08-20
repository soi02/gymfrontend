import ca_2nd_project_photo_upload_division_ver2 from '../../../assets/img/market/test/example/ca_2nd_project_photo_upload_division_ver2.png';

export default function MarketFetchMyPhotoOnWriteArticle() {
    
    return (
        <>
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "col">
                        <img src = {ca_2nd_project_photo_upload_division_ver2}
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
        
        </>
    )

}