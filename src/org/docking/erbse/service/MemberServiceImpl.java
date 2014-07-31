package org.docking.erbse.service;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.MemberVO;


public class MemberServiceImpl implements MemberService {

	@Override
	public Integer memberAdd(MemberVO member) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		Integer res = memService.add("member_add", member);
		
		return res;
	}

	@Override
	public Integer memberModify(MemberVO member) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		Integer res = 		memService.modify("member_modify", member);
		
		return res;
	}

	@Override
	public String memberSearch(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		MemberVO mvo = memService.search("member_search", memberId);
		String[] objName = new String[]{"memberVO"};

		/*
		 * DocumentVO Json
		 */
		String jMvo = JsonParser.getInstance().jParseObj(GlobalVariable.MEM_VO_FIELD, new String[]{mvo.getMemberId(),mvo.getPw(),mvo.getMemberName(),String.valueOf(mvo.getType())});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jMvo});
	}

	@Override
	public Integer memberDelete(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		Integer res = genericService.delete("member_delete", memberId);
		
		return res;
	}
	
	@Override
	public Integer memberLogin(String memberId, String pw)
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		MemberVO	memberVO = genericService.search("member_search", memberId);
		
		if(memberVO == null)
		{
			return -1;
		}
		
		else if(!memberVO.getPw().equals(pw))
		{
			return 0;
		}
		
		return 1;
	}
}
