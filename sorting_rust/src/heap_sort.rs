use crate::Animation;

pub fn heap_sort_inner(arr:&mut [i32], animations: &mut Vec<Animation>) {
    for i in 1..arr.len() {
        bouble_up(&mut arr[..=i], animations);
    }
    for i in (0..arr.len()).rev() {
        extract_min(&mut arr[..=i], animations);
    }
}


fn bouble_up(arr: &mut[i32], animations: &mut Vec<Animation>) {
    let mut idx = arr.len()-1;
    loop {
        if idx < 1 { break }
        let parrent_idx = (idx-1)/2;
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
        if arr[2*idx +1] > arr[idx] {
            animations.push(Animation::Swap(2*idx +1,idx));
            arr.swap(2*idx +1,idx);
        }
        return;
    }

    let max;
    animations.push(Animation::Compare(2*idx +1,2*idx +2));
    if arr[2*idx +1] >= arr[2*idx+2] {
        max = 2*idx +1;
    } else {
        max = 2*idx +2;
    }
    if max != idx {
        animations.push(Animation::Compare(max,idx));
        if arr[max] > arr[idx] {
            animations.push(Animation::Swap(max,idx));
            arr.swap(max,idx);
            bouble_down(arr, max, animations);
        }
    }
}

