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
}

