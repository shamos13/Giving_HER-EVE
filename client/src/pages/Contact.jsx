import {useState} from "react";
import {Clock, Mail, MapPin, Phone} from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone:'',
        subject: "",
        inquiry_type: "",
        message: "",
    });

    const contactInfo = [
        {
            icon: <MapPin className="h-6 w-6"/>,
            title:"Our location",
            details:["Nairobi, Kenya", "East Africa"],
            description: "Visit Us or Meet Us in the field"
        },
        {
            icon: <Phone className="h-6 w-6"/>,
            title:"Our location",
            details:["Nairobi, Kenya", "East Africa"],
            description: "Visit Us or Meet Us in the field"
        },
        {
            icon: <Mail className="h-6 w-6"/>,
            title:"Our location",
            details:["Nairobi, Kenya", "East Africa"],
            description: "Visit Us or Meet Us in the field"
        },
        {
            icon: <Clock className="h-6 w-6"/>,
            title:"Our location",
            details:["Nairobi, Kenya", "East Africa"],
            description: "Visit Us or Meet Us in the field"
        }
    ]
}