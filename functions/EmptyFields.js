exports.requiredFieldIsEmpty = (fields={}, requiredArr=[]) => {
    let emptyFields = []
    for(let field in fields){
        if((!fields[field] || fields[field] == '')&& requiredArr.includes(field)){
            emptyFields.push(field)
        }
    }
    return emptyFields
}


exports.selectedNumItem = (arr, num=2) => {
    if(arr.length < num){
        return `select at least ${num} elements`
    }
    return true
}