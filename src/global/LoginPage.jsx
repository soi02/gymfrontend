
export default function LoginPage() {
    return (
        <>
            <div className='container-fluid'>
                <div className="row">
                    <div className="col text-center">로그인 페이지</div>
                </div>
                <div className="row">
                    <div className="col">
                        {/* <input name="accountName" onChange={handleChange} value={formData.accountName} type="text" className='form-control' placeholder='아이디' /> */}
                        <input name="accountName" type="text" className='form-control' placeholder='아이디' />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {/* <input name="password" onChange={handleChange} value={formData.password} type="password" className='form-control' placeholder='비밀번호' /> */}
                        <input name="password" type="password" className='form-control' placeholder='비밀번호' />
                    </div>
                </div>
                <div className="row">
                    <div className="col d-grid">
                        {/* <button onClick={handleLogin} className='btn btn-primary'>로그인</button> */}
                        <button  className='btn btn-primary'>로그인</button>
                    </div>
                </div>
            </div>
        </>
    )
}