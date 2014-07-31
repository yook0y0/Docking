package org.docking.erbse.service;

import org.docking.erbse.vo.MemberVO;

public interface MemberService {

	public Integer memberAdd(MemberVO member);
	public Integer memberModify(MemberVO member);
	public String memberSearch(String memberId);
	public Integer memberDelete(String memberId);
	public Integer memberLogin(String memberId,String pw);
}
