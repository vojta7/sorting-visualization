use crate::Animation;

pub fn merge_sort_inner(arr:&mut [i32], animations: &mut Vec<Animation>) {
    let mut work_space = vec![0;arr.len()];
    for (idx,&v) in arr.iter().enumerate() {
        work_space[idx] = v;
    }
    split_merge(&mut work_space, arr, 0, animations);
}

// unstable :( https://rust-lang.github.io/rfcs/2000-const-generics.html
// fn split_merge<const N: usize>(arr:&mut [i32; N], work_space:&mut [i32; N], offset: usize, animations: &mut Vec<Animation>)
fn split_merge(arr:&mut [i32], work_space:&mut [i32], offset: usize, animations: &mut Vec<Animation>) {
    if arr.len() <= 1 {
        return
    }
    let middle = arr.len() / 2;
    split_merge(&mut work_space[..middle],&mut arr[..middle], offset, animations);
    split_merge(&mut work_space[middle..],&mut arr[middle..], middle + offset, animations);
    merge(arr, work_space, offset, animations);
}

fn merge(arr:&mut [i32], work_space:&mut [i32], offset: usize, animations: &mut Vec<Animation>) {
    let end = work_space.len();
    let middle = end / 2;
    let mut i = 0;
    let mut j = middle;

    for k in 0..end {
        if i<middle && (j >= end || arr[i] <= arr[j]) {
            work_space[k] = arr[i];
            animations.push(Animation::Compare(i,j));
            animations.push(Animation::Set(k + offset,arr[i]));
            i += 1;
        } else {
            work_space[k] = arr[j];
            animations.push(Animation::Compare(i+offset,middle+offset));
            animations.push(Animation::Set(k + offset,arr[j]));
            j += 1;
        }
    }
}
