import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginAction } from "../../../redux/authSlice";

function TabItem({ to, label }) {
  
  const location = useLocation();
  const isActive = location.pathname === to;


  return (
<Link
  to={to}
  style={{
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: isActive ? '700' : '500',
    color: isActive ? '#000' : '#aaa',
    borderBottom: isActive ? '2px solid #000' : 'none',
    padding: '10px 12px 8px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    lineHeight: '1',
    verticalAlign: 'bottom',
  }}
>
  {label}
</Link>

  );
}

export default function MarketTopTabs() {
  
    const dispatch = useDispatch();
    
    //
    
    const constToken = localStorage.getItem("token");
    
    if (constToken) {
        
        try {
            
            const decodedToken = jwtDecode(constToken);
            
            console.log("decodedToken : ", decodedToken);
            
        } catch (error) {
            console.error("Token Error :", error)
        }
        
    } else {
        
        console.log("No Token");
        
    }
    
    //
    
    const userId = useSelector(state => state.auth.id);
    
    console.log(userId);
    
    //
    
    useEffect (() => {
      
        const checkAuth = async () => {
            
            console.log("checkAuth is running");
            
            const tokenOnCheckAuth =  localStorage.getItem("token");
            
            if (!tokenOnCheckAuth) {
                
                return;
                
            }
            
            try {
                
                const resOnCheckAuth = await axios.post(
                    "http://localhost:8080/api/user/verify-token",
                    {},
                    { headers: { Authorization: `Bearer ${tokenOnCheckAuth}` } }
                );
                
                if (resOnCheckAuth.data.success) {
                    
                    dispatch(loginAction(resOnCheckAuth.data))
                    
                    console.log("resOnCheckAuth.data : ", resOnCheckAuth.data);
                    
                }
                
            } catch (error) {
                
                console.error("checkAuthError", error);
                localStorage.removeItem("token");
                
            }
            
        }
        
        checkAuth();
        
    }, [])
    
    // ▲ 토큰 관련 문제 (나중에 메인 서버에서 받아서 처리할 것)
  
  const navigate = useNavigate();
  
  // const routesForHeaderType0 = [
  //   '/market/',
  //   '/market/board',
  // ]
  
  const routesForHeaderType1 = [
    // '/market/myLikedProducts',
    '/market/article',
    // '/market/user',
    '/market/writeArticle',
    '/market/update',
  ]
  
  const currentPath = location.pathname;
  
  // const constHeaderType1 = routesForHeaderType1.some(route => currentPath.startsWith(route));
  // console.log("constHeaderType1 : ", constHeaderType1);
  const constHeaderType1 = routesForHeaderType1.some(route => currentPath.startsWith(route));
  console.log("constHeaderType1 : ", constHeaderType1);
    
  const constHeaderType0 = !constHeaderType1;
  console.log("constHeaderType0 : ", constHeaderType0);
    
  return (
    <>
    
      { constHeaderType0 && (
      <div style={{
      borderBottom: '0px solid transparent',
      marginBottom: '0',
      paddingBottom: '0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      padding: '0 12px 0',
      margin: 0,
      overflowX: 'auto',
      border: 'none',
      boxShadow: 'none',
      outline: 'none',
      position: 'relative',
      zIndex: 1,
      backgroundColor: '#fff',
      }}>

        <TabItem to="/market" label="장터 홈" />
        <TabItem to="/market/myLikedProducts" label="탐나는 물품" />
        <TabItem to={`/market/user/${userId}`} label="나의 장터 정보함" />
      </div>
      )}

      { constHeaderType1 && (
        <>
          <div className = "row" style = {{height : "38px"}}>
            <div className = "col d-flex justify-content-start" style = {{backgroundColor: '#fff', borderBottom : "1px solid #f2f2f2ff"}}>
              {/* <div className = "row"> */}
                <div className = "col-auto basicDivisionOnClickStyle" onClick = {() => navigate(-1)}
                style = {{backgroundColor: '#fff', paddingLeft : "1.5rem", paddingRight : "1.5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <span style = {{fontSize : "1.5rem", color : "#aaa"}}><i className="ri-arrow-left-s-line"></i></span>
                </div>
              {/* </div> */}
            </div>
          </div>
        </>
      )}
      
    </>
  );
}
