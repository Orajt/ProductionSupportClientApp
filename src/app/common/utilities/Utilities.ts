import { format } from "date-fns";
import { FilterResult } from "../../models/filter";

export abstract class Utilities {         

    public static removeItemFromCollectionBasedOnIndex(arr: any[], indexes: number[]) {
        var i = 0;
        while (i < arr.length) {
          if (indexes.some(x=>x==i)) {
            arr.splice(i, 1);
            indexes.forEach(element => {
                element--;
            });
          } else {
            i++;
        }
        }
        console.log(arr);
        return arr;
      }
      public static createFilterQueryString(arr: FilterResult[])
      {
          const params=new URLSearchParams();
          arr.forEach((filter, index)=>{
            params.append(`filters[${index}].propertyName`, `${filter.propertyName}`);
            params.append(`filters[${index}].filterOption`, `${filter.filterOption}`);
            if(filter.intValue!==0) params.append(`filters[${index}].intValue`, `${filter.intValue}`);
            if(filter.dateValue!==null) params.append(`filters[${index}].dateValue`, `${filter.dateValue.toISOString()}`);
            if(filter.stringValue!=="") params.append(`filters[${index}].stringValue`, filter.stringValue);
            
          })
          return params;
          
      }
      public static getFilterDescription(filter: FilterResult)
      {
          let description=`${filter.propertyName} ${filter.filterOption}`
          if(filter.intValue!==0)
              return `${description} ${filter.intValue}; `
          if(filter.dateValue!==null)
              return `${description} ${format(filter.dateValue, 'dd MMM yyyy')}; `
          if(filter.stringValue)
              return `${description} ${filter.stringValue}; `
            
      }
      
}

