package kr.co.docking.service;

import kr.co.docking.vo.MemberVO;

public interface MemberService {

	public Integer memberAdd(MemberVO member);
	public Integer memberModify(MemberVO member);
	public String memberSearch(String memberId);
	public Integer memberDelete(String memberId);
}
