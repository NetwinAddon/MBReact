
const PAN_PATTERN = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
const AADHAAR_PATTERN = /^\d{12}$/;
const USERID_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/;

const BLANKSPACE_PATTERN = /\s/;
const NUMBERONLY_PATTERN = /^\d+$/;

class MyValidator {



    static isBlankSpacePresent = (value) => {
        const Text = value

        let Response = '';

        if (BLANKSPACE_PATTERN.test(Text)) {
            Response = 'Please remove blank space'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }

    };

    static isNumberOnlyPresent = (value) => {
        const Text = value

        let Response = '';
        if (BLANKSPACE_PATTERN.test(Text)) {
            Response = 'Please remove blank space'
            return { isValid: false, Response };
        }
        else if (!NUMBERONLY_PATTERN.test(Text)) {
            Response = 'Please remove special characters'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }

    };

    static isValidIndianMobile = (mobNo) => {
        const MobNo = mobNo

        let Response = '';


        if (MobNo.length === 0) {

            Response = 'Please enter mobile number'
            return { isValid: false, Response };
        }
        else {

            const isBlankSpace = /\s/.test(MobNo);
            if (isBlankSpace) {
                Response = 'Please remove blank space'
                return { isValid: false, Response };
            }

            const isNumber = /^\d+$/.test(MobNo);

            if (!isNumber) {
                Response = 'Please remove special characters'
                return { isValid: false, Response };
            }

            if (MobNo.length !== 10) {

                Response = 'Please enter 10 digit number'
                return { isValid: false, Response };
            }
            else {
                return { isValid: true, Response };
            }


        }


    };

    static isEmptyField = (value) => {
        const Text = value

        let Response = '';

        if (Text.length === 0) {
            Response = 'Please enter a value'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }
    };


    static isValidDate = (value) => {
        const Text = value

        let Response = '';

        if (Text.length === 0) {
            Response = 'Please select a date'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }
    };


    static isValidAadharCard = (value) => {
        const Text = value

        let Response = '';

        if (!AADHAAR_PATTERN.test(Text)) {
            Response = 'Please enter a valid aadhar number'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }

    };

    static isValidPanCard = (value) => {
        const Text = value

        let Response = '';

        if (!PAN_PATTERN.test(Text.toUpperCase())) {
            Response = 'Please enter a valid pan number'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }

    };

    static isConfirmPassword = (value, value2) => {
        const newPass = value
        const comfirmPass = value2

        let Response = '';

        if (newPass.length <= 5) {
            Response = 'Password length should be greater than 5'
            return { isValid: false, Response };
        }

        if (comfirmPass.length <= 5) {
            Response = 'Confirm password length should be greater than 5'
            return { isValid: false, Response };
        }

        if (newPass.includes(" ")) {
            Response = 'Please remove white space';
            return { isValid: false, Response };
        }

        if (comfirmPass.includes(" ")) {
            Response = 'Please remove white space';
            return { isValid: false, Response };
        }

        if (newPass === comfirmPass) {
            Response = ''
            return { isValid: true, Response };
        }
        else {
            Response = 'Password are not matching'
            return { isValid: false, Response };
        }



    };


    static isConfirmTrasactionPassword = (value, value2) => {
        const newPass = value
        const comfirmPass = value2

        let Response = '';

        if (newPass.length <= 6) {
            Response = 'Transaction password length should be greater than 6'
            return { isValid: false, Response };
        }
        if (comfirmPass.length <= 6) {
            Response = 'Transaction password length should be greater than 6'
            return { isValid: false, Response };
        }
        
        if (newPass.includes(" ")) {
            Response = 'Please remove white space';
            return { isValid: false, Response };
        }

        if (comfirmPass.includes(" ")) {
            Response = 'Please remove white space';
            return { isValid: false, Response };
        }

        if (newPass === comfirmPass) {
            Response = ''
            return { isValid: true, Response };
        }
        else {
            Response = 'Password are not matching'
            return { isValid: false, Response };
        }



    };


    static isValidUserId = (value) => {
        const Text = value

        let Response = '';


        if (!USERID_PATTERN.test(Text)) {
            Response = 'Please enter a valid User Id'
            return { isValid: false, Response };
        }
        else {
            return { isValid: true, Response };

        }


    };



}
export default MyValidator;