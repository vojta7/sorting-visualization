mod utils;

use wasm_bindgen::prelude::*;
use serde::Serialize;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Serialize)]
enum Animation {
    Compare(usize,usize),
    Swap(usize,usize)
}


fn bouble_sort_inner(array: &[i32]) -> (Vec<i32>,Vec<Animation>)
{
    let mut animations = Vec::new();
    let mut array = array.to_owned();
    for i in 1..(array.len()) {
        for j in 0..(array.len() - i) {
            animations.push(Animation::Compare(j,j+1));
            if array[j] > array[j+1] {
                animations.push(Animation::Swap(j,j+1));
                let tmp = array[j];
                array[j] = array[j+1];
                array[j+1] = tmp;
            }
        }
    }
    (array,animations)
}

#[wasm_bindgen]
pub fn bouble_sort(array: &[i32]) -> JsValue {
    JsValue::from_serde(&bouble_sort_inner(array).1).unwrap()
}

#[wasm_bindgen]
pub fn init() {
    utils::set_panic_hook()
}

#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn test_bouble_sort() {
        let arr = [1,5,2,3,8,6];
        let (sorted,_animations) = bouble_sort_inner(&arr);
        assert_eq!(sorted.as_ref(), [1,2,3,5,6,8]);
    }
}
