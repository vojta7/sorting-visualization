mod utils;

use wasm_bindgen::prelude::*;
use serde::Serialize;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod bouble_sort;
use bouble_sort::*;
mod heap_sort;
use heap_sort::*;
mod quick_sort;
use quick_sort::*;
mod merge_sort;
use merge_sort::*;

#[derive(Serialize)]
pub enum Animation {
    Compare(usize,usize),
    Swap(usize,usize),
    Set(usize,i32),
}


#[wasm_bindgen]
pub fn bouble_sort(array: &[i32]) -> JsValue {
    let mut arr = array.to_owned();
    let mut animations = Vec::new();
    bouble_sort_inner(&mut arr, &mut animations);
    JsValue::from_serde(&animations).unwrap()
}

#[wasm_bindgen]
pub fn heap_sort(array: &[i32]) -> JsValue {
    let mut arr = array.to_owned();
    let mut animations = Vec::new();
    heap_sort_inner(&mut arr, &mut animations);
    JsValue::from_serde(&animations).unwrap()
}

#[wasm_bindgen]
pub fn quick_sort(array: &[i32]) -> JsValue {
    let mut arr = array.to_owned();
    let mut animations = Vec::new();
    let len = arr.len() -1;
    quick_sort_inner(&mut arr, 0, len, &mut animations);
    JsValue::from_serde(&animations).unwrap()
}

#[wasm_bindgen]
pub fn merge_sort(array: &[i32]) -> JsValue {
    let mut arr = array.to_owned();
    let mut animations = Vec::new();
    merge_sort_inner(&mut arr, &mut animations);
    JsValue::from_serde(&animations).unwrap()
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
        let mut arr = [ 4, 5, 9, 1, 2, 4, 5, 7, 7, 1 ];
        let mut animations = Vec::new();
        bouble_sort_inner(&mut arr, &mut animations);
        assert_eq!(arr.as_ref(), [1,1,2,4,4,5,5,7,7,9]);
    }
    #[test]
    fn test_heap_sort() {
        let mut arr = [ 4, 5, 9, 1, 2, 4, 5, 7, 7, 1 ];
        let mut animations = Vec::new();
        heap_sort_inner(&mut arr, &mut animations);
        assert_eq!(arr.as_ref(), [1,1,2,4,4,5,5,7,7,9]);
    }
    #[test]
    fn test_quick_sort() {
        let mut arr = [ 4, 5, 9, 1, 2, 4, 5, 7, 7, 1 ];
        let mut animations = Vec::new();
        let len = arr.len() -1;
        quick_sort_inner(&mut arr, 0, len, &mut animations);
        assert_eq!(arr.as_ref(), [1,1,2,4,4,5,5,7,7,9]);
    }
    #[test]
    fn test_merge_sort() {
        let mut arr = [ 4, 5, 9, 1, 2, 4, 5, 7, 7, 1 ];
        let mut animations = Vec::new();
        merge_sort_inner(&mut arr, &mut animations);
        assert_eq!(arr.as_ref(), [1,1,2,4,4,5,5,7,7,9]);
    }
}
