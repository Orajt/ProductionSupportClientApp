export class FilterResult{
    constructor(propertyName?: string, filterOption?: string){
        if(propertyName && filterOption)
        {
            this.propertyName=propertyName;
            this.filterOption=filterOption;
        }  
    }

    propertyName: string="";
    intValue: number | null=0;
    dateValue: Date | null = null;
    stringValue: string="";
    booleanValue: boolean | null = null;
    filterOption: string="";
    destroy: boolean=false;


}