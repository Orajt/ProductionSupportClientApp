import { Route, useNavigate } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import Unauthorized from "../../features/errors/Unauthrized";
import { useStore } from "../stores/store";

interface Props extends RouteProps {    
    component: React.ReactNode;
}

export default function PrivateRoute({ component, ...rest }: Props) {
    const { userStore: { isLoggedIn }} = useStore();
    const redirect = useNavigate();
    if(!isLoggedIn){
        return <Unauthorized></Unauthorized>
    }
        
    return(
        <div>
            {component}
        </div>   
    )
}