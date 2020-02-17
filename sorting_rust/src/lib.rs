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

fn bouble_up(arr: &mut[i32], animations: &mut Vec<Animation>) {
    let mut idx = arr.len()-1;
    loop {
        if idx < 1 { break }
        let parrent_idx = (idx-1)/2;
        animations.push(Animation::Compare(parrent_idx,idx));
        animations.push(Animation::Compare(parrent_idx,idx));
        if arr[parrent_idx] < arr[idx] {
            animations.push(Animation::Swap(parrent_idx,idx));
            arr.swap(parrent_idx,idx);
        }
        idx = parrent_idx;
    }
}

fn extract_min(arr: &mut[i32], animations: &mut Vec<Animation>) {
    let new_len = arr.len()-1;
    animations.push(Animation::Swap(0,new_len));
    arr.swap(0, new_len);
    bouble_down(&mut arr[..new_len], 0, animations);
}
fn bouble_down(arr: &mut[i32], idx: usize, animations: &mut Vec<Animation>) {
    if arr.len() <= 2*idx +1 { return }
    if arr.len() <= 2*idx +2 {
        animations.push(Animation::Compare(2*idx +1,idx));
        animations.push(Animation::Compare(2*idx +1,idx));
        if arr[2*idx +1] > arr[idx] {
            animations.push(Animation::Swap(2*idx +1,idx));
            arr.swap(2*idx +1,idx);
        }
        return;
    }

    let max;
    animations.push(Animation::Compare(2*idx +1,2*idx +2));
    animations.push(Animation::Compare(2*idx +1,2*idx +2));
    if arr[2*idx +1] >= arr[2*idx+2] {
        max = 2*idx +1;
    } else {
        max = 2*idx +2;
    }
    if max != idx {
        animations.push(Animation::Compare(max,idx));
        animations.push(Animation::Compare(max,idx));
        if arr[max] > arr[idx] {
            animations.push(Animation::Swap(max,idx));
            arr.swap(max,idx);
            bouble_down(arr, max, animations);
        }
    }
}

fn heap_sort_inner(arr:&mut [i32], animations: &mut Vec<Animation>) {
    for i in 1..arr.len() {
        bouble_up(&mut arr[..=i], animations);
    }
    for i in (0..arr.len()).rev() {
        extract_min(&mut arr[..=i], animations);
    }
}

#[wasm_bindgen]
pub fn bouble_sort(array: &[i32]) -> JsValue {
    JsValue::from_serde(&bouble_sort_inner(array).1).unwrap()
}

#[wasm_bindgen]
pub fn heap_sort(array: &[i32]) -> JsValue {
    let mut arr = array.to_owned();
    let mut animations = Vec::new();
    heap_sort_inner(&mut arr, &mut animations);
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
        let arr = [1,5,2,3,8,6];
        let (sorted,_animations) = bouble_sort_inner(&arr);
        assert_eq!(sorted.as_ref(), [1,2,3,5,6,8]);
    }
    #[test]
    fn test_heap_sort() {
        let mut arr = [ 6, 2, 9, 4, 8, 10, 7, 9, 5, 9 ];
        let mut animations = Vec::new();
        heap_sort_inner(&mut arr, &mut animations);
        assert_eq!(arr.as_ref(), [2,4,5,6,7,8,9,9,9,10]);
    }
    #[test]
    fn test_heap_sort2() {
        let mut arr = [ 4, 5, 9, 1, 2, 4, 5, 7, 7, 1 ];
        let mut animations = Vec::new();
        heap_sort_inner(&mut arr, &mut animations);
        assert_eq!(arr.as_ref(), [1,1,2,4,4,5,5,7,7,9]);
    }
}
