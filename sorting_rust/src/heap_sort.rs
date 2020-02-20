use crate::Animation;

#[inline(always)]
fn left_child(idx: usize) -> usize {
    2*idx+1
}

#[inline(always)]
fn right_child(idx: usize) -> usize {
    2*idx+2
}

#[inline(always)]
fn parrent(idx: usize) -> usize {
    (idx-1)/2
}


/// Basic heap sort
///
/// time: O(N log N)
/// space: O(1)
/// not stable
///
/// constructs max heap inplace and then extracts max elemenets placing them to the end of array
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
        let parrent_idx = parrent(idx);
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
    if arr.len() <= left_child(idx) { return }
    if arr.len() <= right_child(idx) {
        animations.push(Animation::Compare(left_child(idx),idx));
        if arr[2*idx +1] > arr[idx] {
            animations.push(Animation::Swap(left_child(idx),idx));
            arr.swap(left_child(idx),idx);
        }
        return;
    }

    let max;
    animations.push(Animation::Compare(left_child(idx),right_child(idx)));
    if arr[left_child(idx)] >= arr[right_child(idx)] {
        max = left_child(idx);
    } else {
        max = right_child(idx);
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

/// Heap sort with Floyd's heap construction
///
/// time: O(N log N)
/// space: O(1)
/// not stable
///
/// constructs max heap in linear time from bottom up using sift_down and then extracts max elemenets placing them to the end of array
pub fn heap_sort2_inner(arr:&mut [i32], animations: &mut Vec<Animation>) {
    for i in (0..arr.len()/2).rev() {
        sift_down(arr, i, animations);
    }
    for i in (0..arr.len()).rev() {
        extract_min2(&mut arr[..=i], animations);
    }
}

fn extract_min2(arr: &mut[i32], animations: &mut Vec<Animation>) {
    let new_len = arr.len()-1;
    animations.push(Animation::Swap(0,new_len));
    arr.swap(0, new_len);
    sift_down(&mut arr[..new_len], 0, animations);
}

fn leaf_search(arr: &[i32], idx: usize, animations: &mut Vec<Animation>) -> usize {
    let mut j = idx;
    while right_child(j) < arr.len() {
        animations.push(Animation::Compare(right_child(j),left_child(j)));
        if arr[right_child(j)] > arr[left_child(j)] {
            j = right_child(j);
        } else {
            j = left_child(j);
        }
    }
    if left_child(j) < arr.len() {
        j = left_child(j);
    }
    j
}

fn sift_down(arr: &mut[i32], idx: usize, animations: &mut Vec<Animation>) {
    if arr.len() <= 1 {
        return;
    }
    let mut j = leaf_search(arr, idx, animations);
    animations.push(Animation::Compare(idx,j));
    while arr[idx] > arr[j] {
        j = parrent(j);
        animations.push(Animation::Compare(idx,j));
    }
    let mut x = arr[j];
    arr[j] = arr[idx];
    animations.push(Animation::Set(j,arr[idx]));
    animations.push(Animation::Compare(j,idx));
    while j > idx {
        j = parrent(j);
        animations.push(Animation::Set(j,x));
        std::mem::swap(&mut x, &mut arr[j]);
    }
}
