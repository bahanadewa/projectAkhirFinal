import React from 'react'
import '../support/css/cssfooter.css'

class Footer extends React.Component {
    render(){
        return(
        <div class="card-footer text-center" style={{height:"80px"}}>
            <div className="row">
                <div className="col-md-3"></div>

                <div className="col-md-6">
                    <div>
                        <img src="https://cdn0.iconfinder.com/data/icons/social-flat-rounded-rects/512/facebook-512.png" className="footer" width="18px" style={{margin:"10px", padding:"px"}} />
                        <img src="https://cdn0.iconfinder.com/data/icons/social-network-7/50/4-512.png" className="footer"  width="17px" style={{margin:"10px"}}/>
                        <img src="https://cdn2.iconfinder.com/data/icons/social-icons-color/512/gmail-512.png" className="footer"  width="18px" style={{margin:"10px"}} />
                        <img src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Instagram-512.png" className="footer"  width="18px" style={{margin:"10px"}}/>
                    </div>
                    <div style={{fontSize:"10px"}}>
                        2019 BAHANA SUKMA DEWA. All Right Reserved
                    </div>
                </div>

                <div className="col-md-3"></div>
            </div>
        </div>
        )
    }
}
export default Footer